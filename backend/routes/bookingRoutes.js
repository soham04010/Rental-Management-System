// backend/routes/bookingRoutes.js
import express from "express";
import Booking from "../models/Booking.js";
import Rental from "../models/Rental.js";

export default function(io) {
  const router = express.Router();

  // Create booking
  router.post("/", async (req, res) => {
    try {
      const { productId, userId, startDate, endDate } = req.body;

      console.log("Booking request body:", req.body);

      if (!productId || !startDate || !endDate) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start) || isNaN(end) || start > end) {
        return res.status(400).json({ message: "Invalid date range." });
      }

      // Check for booking conflicts (using 'rental' field)
      const conflict = await Booking.findOne({
        rental: productId,
        status: { $ne: "cancelled" },
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
      });

      if (conflict) {
        return res.status(409).json({ message: "Selected dates are not available." });
      }

      // Verify rental exists
      const rental = await Rental.findById(productId);
      if (!rental) return res.status(404).json({ message: "Product not found." });

      // Calculate total booking amount
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.max(1, Math.ceil((end - start) / msPerDay) + 1);
      const totalAmount = (rental.price || 0) * days;

      // Create booking with 'rental' and 'user' fields
      const booking = await Booking.create({
        rental: productId,
        user: userId || null,
        startDate: start,
        endDate: end,
        totalAmount,
        status: "pending"
      });

      io.emit("booking_created", booking);

      return res.status(201).json(booking);
    } catch (err) {
      console.error("Error creating booking:", err);
      return res.status(500).json({ message: "Server error creating booking." });
    }
  });

  // Get bookings for a product (by rental ID)
  router.get("/product/:id", async (req, res) => {
    try {
      const bookings = await Booking.find({ rental: req.params.id }).sort({ startDate: 1 });
      res.json(bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ message: "Server error fetching bookings." });
    }
  });

  // Get bookings for a user
  router.get("/user/:id", async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.params.id }).sort({ createdAt: -1 });
      res.json(bookings);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      res.status(500).json({ message: "Server error fetching user bookings." });
    }
  });

  // Update booking status
  router.put("/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }
      const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!booking) return res.status(404).json({ message: "Booking not found." });

      io.emit("booking_updated", booking);
      res.json(booking);
    } catch (err) {
      console.error("Error updating booking status:", err);
      res.status(500).json({ message: "Server error updating booking." });
    }
  });

  return router;
}

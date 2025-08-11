import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Rental from "../models/Rental.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

export default function(io) {
  // GET all rentals
  router.get("/", async (req, res) => {
    try {
      const rentals = await Rental.find().sort({ createdAt: -1 });
      res.json(rentals);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      res.status(500).json({ error: "Failed to fetch rentals" });
    }
  });

  // POST a new rental
  router.post("/", upload.array("images"), async (req, res) => {
    try {
      console.log("\n✅ Add rental request received. Processing...");
      const { name, description, price } = req.body;
      const urls = [];

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images were uploaded." });
      }

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "rentals" },
            (error, result) => (error ? reject(error) : resolve(result))
          );
          stream.end(file.buffer);
        });
        urls.push(result.secure_url);
      }
      
      console.log("✅ Images uploaded to Cloudinary.");
      
      const rental = new Rental({
        name,
        description,
        price,
        images: urls,
        createdBy: '66b50e39544a422a57321033' // Temporary placeholder ID
      });
      
      await rental.save();
      console.log("✅ Rental saved to database.");

      io.emit("rental_added", rental);
      res.status(201).json(rental);

    } catch (err) {
      console.error("❌ ERROR CREATING RENTAL:", err);
      res.status(500).json({ error: "Error creating rental. Check backend logs." });
    }
  });

  // DELETE a rental
  router.delete("/:id", async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found." });
      }
      
      await Rental.findByIdAndDelete(req.params.id);
      
      io.emit("rental_deleted", req.params.id);
      res.json({ message: "Rental deleted successfully." });
    } catch (err) {
      console.error("Error deleting rental:", err);
      res.status(500).json({ error: "Failed to delete rental." });
    }
  });

  return router;
}
import express from 'express';
import Order from '../models/Order.js';
// We will need to protect these routes later with authentication middleware
// import { authMiddleware } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// --- CREATE A NEW ORDER ---
// This endpoint will be called when a user clicks "Rent Now" and confirms.
// For now, it's public. We will add `authMiddleware` later.
router.post('/', async (req, res) => {
  try {
    const { 
      userId, 
      rentalId,
      customerName,
      customerEmail,
      startDate, 
      endDate, 
      totalAmount 
    } = req.body;

    // Basic validation
    if (!userId || !rentalId || !startDate || !endDate || !totalAmount) {
      return res.status(400).json({ error: 'Missing required booking information.' });
    }

    const newOrder = new Order({
      userId,
      rentalId,
      customerName,
      customerEmail,
      startDate,
      endDate,
      totalAmount,
      status: 'confirmed' // Or 'pending' if you need an approval step
    });

    await newOrder.save();

    // You could emit a socket event here to notify the admin dashboard
    // req.app.get('io').emit('order_added', newOrder);

    res.status(201).json({ message: 'Booking successful!', order: newOrder });

  } catch (err) {
    console.error("❌ ERROR CREATING ORDER:", err);
    res.status(500).json({ error: "Failed to create order. Please try again." });
  }
});


// --- GET ALL ORDERS FOR A SPECIFIC USER ---
// This will be useful for a "My Bookings" page for the customer.
// It should also be protected by authMiddleware later.
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
                              .populate('rentalId') // This replaces rentalId with the full rental document
                              .sort({ createdAt: -1 });

    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.json(orders);
  } catch (err) {
    console.error("❌ ERROR FETCHING USER ORDERS:", err);
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

export default router;
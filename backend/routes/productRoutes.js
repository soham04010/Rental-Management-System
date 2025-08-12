import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Create new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, images } = req.body;
    if (!name || !price) return res.status(400).json({ message: "Name and price required" });

    const product = new Product({ name, description, price, images: images || [] });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

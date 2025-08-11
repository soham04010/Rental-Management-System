import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// Add new product
router.post("/", async (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = new Product({ name, price, description });
  await newProduct.save();
  res.json(newProduct);
});

export default router;

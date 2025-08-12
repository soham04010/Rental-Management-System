import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String], // array of image URLs
}, { timestamps: true });

export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],          // multiple images
  availableFrom: Date,
  availableTo: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Rental", rentalSchema);

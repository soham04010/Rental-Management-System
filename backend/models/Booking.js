// backend/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Rental", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if you have auth
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["pending","confirmed","cancelled","completed"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);

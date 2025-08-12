// models/Booking.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  rental: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: Date,
  endDate: Date,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Booking', bookingSchema);

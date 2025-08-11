import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Link to the user who made the booking
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Link to the rental product that was booked
  rentalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rental', 
    required: true 
  },
  // Customer details (even though we have userId, storing this can be convenient)
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  
  // Booking dates
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // Financial details
  totalAmount: { type: Number, required: true },

  // Status of the booking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamp for when the order was created
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('Order', orderSchema);
// server.js
import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import rentalRoutes from "./routes/rentalRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"; // new
import authRoutes from "./routes/authRoutes.js"; // if you have - otherwise skip
import uploadRoutes from "./routes/uploadRoutes.js"; // optional
import productRoutes from "./routes/productRoutes.js";  
import http from "http";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use("/api/uploads", uploadRoutes); // optional

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET","POST","DELETE"], credentials: true }
});

// pass io to routes that need it
app.use("/api/rentals", rentalRoutes(io));
app.use("/api/bookings", bookingRoutes(io));
app.use("/api/auth", authRoutes); // optional
app.use("/api/products", productRoutes);

io.on("connection", socket => {
  console.log("User connected", socket.id);
  socket.on("disconnect", () => console.log("User disconnected", socket.id));
});

// connect mongoose
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`🚀 Server running on ${PORT}`));

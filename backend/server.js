import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary
import rentalRoutes from "./routes/rentalRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import http from "http";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

// Configure Cloudinary here, right after loading environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use("/api/uploads", uploadRoutes);

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
  }
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/rentals", rentalRoutes(io));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server & WebSocket running on port ${PORT}`));
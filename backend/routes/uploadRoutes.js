import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const urls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "rentals" },
        (error, uploaded) => {
          if (error) throw error;
        }
      );

      const stream = cloudinary.uploader.upload_stream(
        { folder: "rentals" },
        (error, result) => {
          if (error) return res.status(500).json({ error });
          urls.push(result.secure_url);
          if (urls.length === req.files.length) {
            res.json({ urls });
          }
        }
      );
      stream.end(file.buffer);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

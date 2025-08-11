"use client";

import { useState } from "react";
import { storage, db } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return alert("Please select an image first!");

    setLoading(true);

    try {
      // Step 1: Upload to Firebase Storage
      const imageRef = ref(storage, `uploads/${image.name}`);
      await uploadBytes(imageRef, image);

      // Step 2: Get the download URL
      const downloadURL = await getDownloadURL(imageRef);

      // Step 3: Save URL to Firestore
      await addDoc(collection(db, "images"), {
        url: downloadURL,
        createdAt: serverTimestamp()
      });

      alert("Image uploaded successfully!");
      setImage(null);
    } catch (error) {
      console.error("Upload error:", error);
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files[0]) {
            setImage(files[0]);
          } else {
            setImage(null);
          }
        }}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
}

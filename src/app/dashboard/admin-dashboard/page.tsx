"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api"; 
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AdminDashboard() {
  interface Rental {
    _id: string;
    name: string;
    description: string;
    price: number | string;
    images?: string[];
  }

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchRentals();

    // Listen for new rentals and add them to the top of the list
    socket.on("rental_added", (newRental: Rental) => {
      setRentals(prevRentals => [newRental, ...prevRentals]);
    });

    // Listen for deleted rentals and remove them from the list
    socket.on("rental_deleted", (deletedId: string) => {
      setRentals(prevRentals => prevRentals.filter(r => r._id !== deletedId));
    });

    // Cleanup listeners when the component unmounts
    return () => {
      socket.off("rental_added");
      socket.off("rental_deleted");
    };
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await api.get("/rentals");
      setRentals(res.data);
    } catch (error) {
        console.error("Failed to fetch rentals:", error);
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    } else {
      setFiles([]);
    }
  };

  // This is your fully restored function for adding a rental with images
  const handleAdd = async () => {
    if (!form.name || !form.description || !form.price || files.length === 0) {
      alert("Please fill all fields and select images.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      files.forEach(file => formData.append("images", file));

      // The request now sends the form data with the images
      await api.post("/rentals", formData);

      // Clear the form fields after successful upload
      setForm({ name: "", description: "", price: "" });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setFiles([]);

    } catch (err) {
      console.error(err);
      alert("Error adding rental. Please check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) {
        return;
    }
    try {
      await api.delete(`/rentals/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error deleting rental.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="p-4 border rounded-md bg-gray-50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Name"
              className="p-2 border rounded"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Price"
              className="p-2 border rounded"
              value={form.price}
              type="number"
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="p-2 border rounded md:col-span-2"
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input 
              type="file" 
              multiple 
              onChange={handleFiles} 
              className="md:col-span-2"
            />
        </div>
        <button 
          onClick={handleAdd} 
          disabled={uploading} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Add Rental"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map(r => (
          <div key={r._id} className="border rounded-lg overflow-hidden shadow-lg">
            {r.images && r.images.length > 0 && (
                <img
                    src={r.images[0]}
                    alt={r.name}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{r.name}</h3>
              <p className="text-gray-700 font-bold">₹{r.price}</p>
              <p className="text-gray-600 mt-2">{r.description}</p>
              <button 
                onClick={() => handleDelete(r._id)} 
                className="mt-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
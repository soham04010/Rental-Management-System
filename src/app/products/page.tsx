"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import io from "socket.io-client";
import Link from "next/link";

const socket = io("http://localhost:5000");

export default function ProductsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/rentals");
        if (!mounted) return;
        setRentals(res.data);
      } catch (err) {
        console.error("Error loading rentals:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    socket.on("rental_added", (r) => setRentals(prev => [r, ...prev]));
    socket.on("rental_deleted", (id) => setRentals(prev => prev.filter(x => x._id !== id)));
    socket.on("rental_updated", (r) => setRentals(prev => prev.map(p => p._id === r._id ? r : p)));

    socket.on("booking_created", (b) => {
      console.log("New booking:", b);
    });

    return () => {
      mounted = false;
      socket.off("rental_added");
      socket.off("rental_deleted");
      socket.off("rental_updated");
      socket.off("booking_created");
    };
  }, []);

  if (loading) return <div className="p-8">Loading rentals...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Available Rentals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rentals.map(r => (
          <div key={r._id} className="border rounded shadow p-4">
            <div className="h-48 bg-gray-100 mb-3 overflow-hidden">
              {r.images?.length ? (
                <img src={r.images[0]} alt={r.name} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center">No image</div>
              )}
            </div>
            <h2 className="text-xl font-semibold">{r.name}</h2>
            <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="font-bold">₹{r.price}/day</div>
              <Link href={`/product/${r._id}`} className="px-3 py-1 bg-blue-600 text-white rounded">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

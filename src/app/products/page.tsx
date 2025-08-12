"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export default function ProductsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingProductId, setBookingProductId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

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

  async function handleBookingSubmit(e) {
    e.preventDefault();
    if (!bookingProductId) return;

    // Basic client validation of dates
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date cannot be after end date.");
      return;
    }

    setBookingLoading(true);
    try {
       const userId = "64e55c24a4f0f2458e88f421"; // TODO: Replace with actual logged-in user ID

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: bookingProductId,
          userId,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");

      alert("Booking successful!");

      // Reset booking form state
      setBookingProductId(null);
      setStartDate("");
      setEndDate("");
    } catch (err) {
      alert("Booking failed: " + err.message);
    } finally {
      setBookingLoading(false);
    }
  }

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
            <div className="font-bold mt-3">₹{r.price}/day</div>

            {bookingProductId === r._id ? (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-2">
                <div>
                  <label>
                    Start Date:{" "}
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    End Date:{" "}
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setBookingProductId(null)}
                  className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setBookingProductId(r._id)}
                disabled={bookingProductId !== null}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
              >
                Rent Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

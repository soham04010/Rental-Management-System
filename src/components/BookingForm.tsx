// components/BookingForm.jsx
"use client";
import React, { useState } from "react";
import api from "@/lib/api";

export default function BookingForm({ product, onSuccess }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!startDate || !endDate) { setError("Pick dates"); return; }
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        productId: product._id,
        startDate,
        endDate
      });
      if (res.status === 201 || res.status === 200) {
        onSuccess?.();
        alert("Booking created! Check your bookings.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) setError("Dates not available");
      else setError("Error creating booking");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-3">
        <label>Start date
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="border p-2 w-full" />
        </label>
        <label>End date
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="border p-2 w-full" />
        </label>
        {error && <div className="text-red-600">{error}</div>}
        <button type="submit" disabled={loading} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
}

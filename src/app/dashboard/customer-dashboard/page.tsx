"use client";

import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  // Simulate logged-in user ID - replace with real auth user id
  const [userId] = React.useState("64e55c24a4f0f2458e88f421");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [userId]);

  if (loading) return <div className="p-8">Loading bookings...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>

      {bookings.length === 0 && <p>No bookings found.</p>}

      <ul className="space-y-4">
        {bookings.map((booking: any) => (
          <li key={booking._id} className="border rounded p-4 shadow">
            <p><strong>Booking ID:</strong> {booking._id}</p>
            <p><strong>Rental Product ID:</strong> {booking.rental}</p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(booking.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
            <p><strong>Status:</strong> {booking.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// app/product/[id]/ProductDetailClient.jsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingForm from "@/components/BookingForm";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ProductDetailClient({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://localhost:5000/api/bookings/product/${product._id}`);
      if (res.ok) setBookings(await res.json());
    };
    load();

    socket.on("booking_created", b => {
      if (b.productId === product._id) setBookings(prev => [...prev, b]);
    });
    return () => {
      socket.off("booking_created");
    };
  }, [product._id]);

  const booked = bookings.some(b => {
    const now = new Date();
    return new Date(b.startDate) <= now && new Date(b.endDate) >= now;
  });

  return (
    <div className="p-8 container mx-auto max-w-4xl">
      <Link href="/products">← Back to products</Link>
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div>
          {product.images?.length ? product.images.map((img,i)=> <img key={i} src={img} className="mb-2 w-full object-cover" />) : <div className="h-64 bg-gray-100" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-3">{product.description}</p>
          <div className="mt-4 text-2xl font-bold">₹{product.price}/day</div>

          {booked ? <div className="mt-4 p-3 bg-yellow-100">Currently booked</div> : <div className="mt-4 p-3 bg-green-100">Available</div>}

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Book Now</button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Book {product.name}</DialogTitle></DialogHeader>
              <BookingForm product={product} onSuccess={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

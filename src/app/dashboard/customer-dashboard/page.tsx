"use client";
import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

type Rental = {
  _id: string;
  name: string;
  price: number;
  description: string;
  images?: (string | Blob | undefined)[];
};

export default function CustomerDashboard() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    fetchRentals();
    socket.on("rental_added", (r: any) => setRentals(prev => [...prev, r]));
    socket.on("rental_deleted", (id: any) => setRentals(prev => prev.filter(x => x._id !== id)));
    return () => {
      socket.off("rental_added");
      socket.off("rental_deleted");
    };
  }, []);

  const fetchRentals = async () => {
    const res = await api.get("/rentals");
    setRentals(res.data);
  };

  return (
    <div className="p-6">
      <h2>Customer Dashboard</h2>
      {rentals.map(r => (
        <div key={r._id} style={{border:"1px solid #eee", padding:10, marginBottom:10}}>
          <h3>{r.name} — ₹{r.price}</h3>
          <p>{r.description}</p>
          <div style={{display:"flex", gap:8}}>
            {r.images?.map((img: string | Blob | undefined,i: React.Key | null | undefined)=> <img key={i} src={img} alt="" style={{width:80, height:80, objectFit:"cover"}} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

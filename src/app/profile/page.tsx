"use client";

import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); // sync latest info
    })
    .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Profile</h1>
          {user ? (
            <div className="space-y-3">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          ) : (
            <p>Loading profile...</p>
          )}
        </Card>
      </main>
    </div>
  );
}

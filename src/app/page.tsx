"use client";

import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          {user?.name ? `Welcome back, ${user.name}!` : "Welcome to RentalHub"}
        </h1>

        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition flex flex-col justify-between">
              <h2 className="text-lg font-semibold">My Bookings</h2>
              <Button className="mt-4" onClick={() => router.push("/bookings")}>
                View Bookings
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition flex flex-col justify-between">
              <h2 className="text-lg font-semibold">Browse Products</h2>
              <Button className="mt-4" onClick={() => router.push("/products")}>
                View Products
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition flex flex-col justify-between">
              <h2 className="text-lg font-semibold">Profile</h2>
              <Button className="mt-4" onClick={() => router.push("/profile")}>
                View Profile
              </Button>
            </Card>
          </div>
        ) : (
          <p className="text-gray-600 text-lg">
            Please login or sign up to access your dashboard.
          </p>
        )}
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AvatarMenu from "./AvatarMenu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <nav className="w-full bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">Rental<span className="text-gray-900">Hub</span></span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Rental<span className="text-gray-900">Hub</span>
        </Link>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button variant="outline" onClick={() => router.push("/login")}>Login</Button>
              <Button onClick={() => router.push("/signup")}>Sign Up</Button>
            </>
          ) : (
            <AvatarMenu user={user} />
          )}
        </div>
      </div>
    </nav>
  );
}

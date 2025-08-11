"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Define the shape of the data for the product being booked
interface Product {
  _id: string;
  name: string;
  price: number;
}

// A wrapper component is needed to use `useSearchParams` with Suspense
const BookingPageContent = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [product, setProduct] = useState<Product | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError("No product selected. Please go back and choose a product to book.");
      return;
    }

    // Fetch details of the product to show its name and price
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rentals/${productId}`);
        if (!response.ok) throw new Error("Could not find the selected product.");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) return 0;
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const bookingDays = calculateDays();
  const totalCost = product ? bookingDays * product.price : 0;

  const handleBookingSubmit = async () => {
    if (bookingDays <= 0) {
      setError("Please select a valid date range.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : { name: "Guest" };

      if (!userId) {
        throw new Error("You must be logged in to make a booking.");
      }

      const response = await fetch(`http://localhost:5000/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rentalId: productId,
          userId: userId,
          customerName: user.name,
          startDate,
          endDate,
          totalAmount: totalCost,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed. The item might be unavailable for these dates.");
      }
      
      alert("Booking successful! You can view it in 'My Bookings'.");
      // Optionally, redirect the user after booking
      // window.location.href = '/my-bookings';

    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product && !error) {
      return <div className="container mx-auto p-8">Loading product details...</div>
  }

  return (
    <div className="container mx-auto max-w-lg p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Booking</CardTitle>
          {product && <p className="text-muted-foreground">You are booking: <strong>{product.name}</strong></p>}
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {bookingDays > 0 && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2 p-4 pt-0">
                <div className="flex justify-between"><span>Days:</span> <span>{bookingDays}</span></div>
                <div className="flex justify-between"><span>Price/day:</span> <span>₹{product?.price}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total Cost:</span> <span>₹{totalCost}</span></div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button onClick={handleBookingSubmit} disabled={isSubmitting || bookingDays <= 0 || !product}>
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

// The main page component uses Suspense to handle the initial loading of search parameters
export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}
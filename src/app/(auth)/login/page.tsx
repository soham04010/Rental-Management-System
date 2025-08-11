"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ use Next.js router
import api from "@/lib/api";
// const rentalBackground = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"; // Example image URL

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", formData);
      // Store in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage(res.data.message);
      // Redirect to home
      router.push("/");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      
      {/* Animated Split Layout */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Title */}
        <div className="w-1/2 flex items-center justify-center p-8 animate-slide-in-left">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Rental<br />
              Management<br />
              <span className="text-rental-primary">System</span>
            </h1>
            <p className="text-xl text-muted-foreground mt-6 max-w-md">
              Manage your properties with ease and efficiency
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-8 animate-slide-in-right">
          <Card className="w-full max-w-md backdrop-blur-md bg-glass-bg border-glass-border shadow-[var(--shadow-glass)]">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
              <p className="text-muted-foreground">Sign in to your account</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="h-12 bg-background/50 border-glass-border backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <Input 
                  id="password"
                  name="password" 
                  type="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  className="h-12 bg-background/50 border-glass-border backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <Button 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-rental-primary to-rental-secondary hover:from-rental-primary/90 hover:to-rental-secondary/90 text-primary-foreground shadow-[var(--shadow-warm)] transition-all duration-300" 
                onClick={handleSubmit}
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              
              {message && (
                <p className={`text-sm text-center mt-4 p-3 rounded-lg ${
                  message.includes("successful") 
                    ? "text-accent bg-accent/10 border border-accent/20" 
                    : "text-destructive bg-destructive/10 border border-destructive/20"
                }`}>
                  {message}
                </p>
              )}
              
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => router.push("/signup")} // ✅ use router.push
                    className="text-rental-primary hover:text-rental-secondary font-medium transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

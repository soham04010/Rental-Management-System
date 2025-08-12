"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useRouter } from "next/navigation"; // ✅ use Next.js router

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer", // default role
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Simple form validation: all fields filled and passwords match

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.confirmPassword.trim() !== "" &&
    formData.password === formData.confirmPassword;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/signup", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage(res.data.message);
      router.push("/");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Hero Text Section */}

        <div className="flex-1 flex items-center justify-center p-8 animate-slide-in-top">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              <span className="text-rental-primary">Join</span> Our<br />
              Rental Management<br />
              System
            </h1>
            <p className="text-xl text-muted-foreground mt-6 max-w-2xl">
              Start managing your properties with our comprehensive platform
            </p>
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="flex-1 flex items-center justify-center p-8 animate-slide-in-bottom">
          <Card className="w-full max-w-md backdrop-blur-md bg-glass-bg border-glass-border shadow-[var(--shadow-glass)]">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-foreground">Create Account</CardTitle>
              <p className="text-muted-foreground">Get started with your rental management</p>
            </CardHeader>


            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 bg-background/50 border-glass-border backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-12 bg-background/50 border-glass-border backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="h-12 bg-background/50 border-glass-border backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="h-12 bg-background/50 border-glass-border backdrop-blur-sm"
                  />
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role">Account Type</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="border rounded-md p-3 w-full bg-background/50 border-glass-border backdrop-blur-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Rental Service Owner</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-rental-primary to-rental-secondary hover:from-rental-primary/90 hover:to-rental-secondary/90 text-primary-foreground shadow-[var(--shadow-warm)] transition-all duration-300"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                {message && (
                  <p
                    className={`text-sm text-center mt-4 p-3 rounded-lg ${
                      message.includes("successfully") 
                        ? "text-accent bg-accent/10 border border-accent/20" 
                        : "text-destructive bg-destructive/10 border border-destructive/20"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      onClick={() => router.push("/login")}
                      className="text-rental-primary hover:text-rental-secondary font-medium transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
            </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
  }
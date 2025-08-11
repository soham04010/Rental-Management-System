"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post("/auth/signup", formData);
      // Store in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage(res.data.message);
      // Redirect to home
      router.push("/");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Password</Label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} />
          </div>
          <Button className="w-full" onClick={handleSubmit}>Sign Up</Button>
          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
    setUser(null);
  };

  if (loading) return null;

  return (
    <nav 
      className={`w-full fixed top-0 z-50 transition-smooth animate-fade-in ${
        isScrolled 
          ? 'glass-effect shadow-elegant' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo with modern styling */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg transition-smooth group-hover:scale-110 group-hover:shadow-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">
            <span className="gradient-text">Rental</span>
            <span className="text-foreground">Hub</span>
          </span>
        </Link>

        {/* Navigation Links with smooth effects */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="nav-link text-foreground font-medium">
            Products
          </Link>
          <Link href="/bookings" className="nav-link text-foreground font-medium">
            Bookings
          </Link>
          {user?.role === "customer" && (
            <Link href="/dashboard/customer-dashboard" className="nav-link text-foreground font-medium">
              <LayoutDashboard className="w-4 h-4 inline mr-2" />
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="./dashboard/admin-dashboard" className="nav-link text-foreground font-medium">
              <Settings className="w-4 h-4 inline mr-2" />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Authentication Section */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/login")}
                className="text-foreground hover:bg-white/10 transition-smooth"
              >
                Login
              </Button>
              <Button 
                className="btn-gradient"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 p-2 hover:bg-white/10 transition-smooth rounded-xl"
                >
                  <Avatar className="w-9 h-9 avatar-glow">
                    <AvatarImage src={user?.avatar || "/default-avatar.png"} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 hidden sm:inline text-foreground font-medium">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 glass-effect border-border/50 animate-slide-down"
                align="end"
              >
                <DropdownMenuItem 
                  onClick={() => router.push("/profile")}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 transition-smooth cursor-pointer"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => router.push("/settings")}
                  className="flex items-center gap-3 p-3 hover:bg-white/10 transition-smooth cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <div className="h-px bg-border/50 my-1" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="flex items-center gap-3 p-3 text-destructive hover:bg-destructive/10 transition-smooth cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
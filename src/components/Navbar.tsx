"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sparkles, Menu, X, User, LogOut, Settings, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  if (loading) {
    return (
      <nav className="w-full fixed top-0 z-50 glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg"></div>
            <div className="w-32 h-6 bg-muted rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav 
      className={`w-full fixed top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-effect border-b border-white/20 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105"
        >
          <div className="p-2 bg-gradient-primary rounded-xl shadow-glow group-hover:shadow-xl transition-all duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">
            Rental<span className="text-foreground">Hub</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Button 
                variant="ghost" 
                className="btn-glass"
                onClick={() => router.push("/login")}
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
                <Button variant="ghost" className="btn-glass p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 hidden sm:inline">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-effect border-white/20">
                <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/bookings")} className="cursor-pointer">
                  <BookOpen className="w-4 h-4 mr-2" />
                  My Bookings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="btn-glass"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass-effect border-b border-white/20 animate-slide-up">
          <div className="px-4 py-6 space-y-4">
            {!user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full btn-glass justify-start"
                  onClick={() => {
                    router.push("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full btn-gradient"
                  onClick={() => {
                    router.push("/signup");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-2 space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start btn-glass"
                    onClick={() => {
                      router.push("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start btn-glass"
                    onClick={() => {
                      router.push("/bookings");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    My Bookings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start btn-glass"
                    onClick={() => {
                      router.push("/settings");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
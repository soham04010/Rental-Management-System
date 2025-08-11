"use client";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Package, 
  User, 
  ArrowRight, 
  Sparkles,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const navigate = (route: string) => router.push(route);

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
    setMounted(true);
  }, []);

  const quickActions = [
    {
      title: "My Bookings",
      description: "View and manage your rental bookings",
      icon: BookOpen,
      route: "/bookings",
      color: "from-blue-500 to-purple-600",
      stats: "12 Active"
    },
    {
      title: "Browse Products",
      description: "Discover amazing products to rent",
      icon: Package,
      route: "/products",
      color: "from-purple-500 to-pink-600",
      stats: "500+ Items"
    },
    {
      title: "Profile",
      description: "Manage your account and preferences",
      icon: User,
      route: "/profile",
      color: "from-emerald-500 to-teal-600",
      stats: "Complete"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navbar />
      
      {/* Hero Section */}
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Welcome Header */}
          <div className={`text-center mb-12 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-full shadow-glow animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {user?.name ? (
                <>
                  Welcome back, <span className="gradient-text">{user.name}</span>!
                </>
              ) : (
                <>
                  Welcome to <span className="gradient-text">RentalHub</span>
                </>
              )}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {user 
                ? "Manage your rentals, discover new products, and track your bookings all in one place."
                : "Discover amazing products to rent, from electronics to furniture. Your one-stop rental marketplace."
              }
            </p>
          </div>

          {user ? (
            <>
              {/* Quick Stats */}
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
                <div className="card-glass p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Clock className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Active Rentals</div>
                </div>
                <div className="card-glass p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">4.9</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="card-glass p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">24</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quickActions.map((action, index) => (
                  <Card
                    key={action.title}
                    className={`card-modern p-8 group cursor-pointer hover-lift ${
                      mounted ? 'animate-scale-in' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(action.route)}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 bg-gradient-to-r ${action.color} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{action.stats}</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    <Button 
                      className="w-full btn-gradient group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(action.route);
                      }}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className={`mt-16 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="card-glass p-6">
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No recent activity to show</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 btn-glass"
                      onClick={() => navigate("/products")}
                    >
                      Browse Products
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Not Logged In */
            <div className={`text-center ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="card-glass p-12 max-w-2xl mx-auto">
                <div className="mb-8">
                  <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground mb-6">
                    Please login or sign up to access your personalized dashboard and start renting amazing products.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="btn-gradient px-8"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="btn-glass px-8"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                {quickActions.map((feature, index) => (
                  <div
                    key={feature.title}
                    className={`card-glass p-6 text-center opacity-60 ${
                      mounted ? 'animate-scale-in' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg mx-auto w-fit mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
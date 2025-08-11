"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  CheckCircle,
  Clock,
  TrendingUp,
  Users
} from "lucide-react";
import api from "@/lib/api"; 
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AdminDashboard() {
  interface Rental {
    _id: string;
    name: string;
    description: string;
    price: number | string;
    images?: string[];
  }

  interface Order {
    _id: string;
    rentalId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
    rental?: Rental;
  }

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchRentals();
    fetchOrders();

    // Listen for new rentals and add them to the top of the list
    socket.on("rental_added", (newRental: Rental) => {
      setRentals(prevRentals => [newRental, ...prevRentals]);
    });

    // Listen for deleted rentals and remove them from the list
    socket.on("rental_deleted", (deletedId: string) => {
      setRentals(prevRentals => prevRentals.filter(r => r._id !== deletedId));
    });

    // Listen for new orders
    socket.on("order_added", (newOrder: Order) => {
      setOrders(prevOrders => [newOrder, ...prevOrders]);
    });

    // Cleanup listeners when the component unmounts
    return () => {
      socket.off("rental_added");
      socket.off("rental_deleted");
      socket.off("order_added");
    };
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await api.get("/rentals");
      setRentals(res.data);
    } catch (error) {
        console.error("Failed to fetch rentals:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      // Mock orders data since API might not exist yet
      const mockOrders: Order[] = [
        {
          _id: "1",
          rentalId: "r1",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+1234567890",
          startDate: "2024-01-15",
          endDate: "2024-01-20",
          totalAmount: 1500,
          status: "active"
        },
        {
          _id: "2",
          rentalId: "r2",
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          customerPhone: "+0987654321",
          startDate: "2024-01-10",
          endDate: "2024-01-12",
          totalAmount: 800,
          status: "completed"
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    } else {
      setFiles([]);
    }
  };

  // This is your fully restored function for adding a rental with images
  const handleAdd = async () => {
    if (!form.name || !form.description || !form.price || files.length === 0) {
      alert("Please fill all fields and select images.");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      files.forEach(file => formData.append("images", file));

      // The request now sends the form data with the images
      await api.post("/rentals", formData);

      // Clear the form fields after successful upload
      setForm({ name: "", description: "", price: "" });
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setFiles([]);

    } catch (err) {
      console.error(err);
      alert("Error adding rental. Please check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this rental?")) {
        return;
    }
    try {
      await api.delete(`/rentals/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error deleting rental.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const stats = {
    totalRentals: rentals.length,
    activeOrders: orders.filter(o => o.status === 'active').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    completedOrders: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold bg-admin-gradient bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your rental business efficiently
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-admin-gradient-soft border border-primary/20 shadow-admin hover:shadow-admin-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRentals}</div>
            <p className="text-xs text-muted-foreground">
              Available for rent
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              Currently rented
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="add-product" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order Details
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Current Rental Inventory
              </CardTitle>
              <CardDescription>
                Manage and view all your rental products
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rentals.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No products available. Add your first rental product!</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setActiveTab("add-product")}
                  >
                    Add First Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rentals.map(rental => (
                    <Card key={rental._id} className="group overflow-hidden border border-border shadow-md hover:shadow-admin transition-all duration-300 hover:scale-[1.02]">
                      {rental.images && rental.images.length > 0 ? (
                        <div className="relative overflow-hidden">
                          <img
                            src={rental.images[0]}
                            alt={rental.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold mb-2 truncate">{rental.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-primary">₹{rental.price}</span>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{rental.description}</p>
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(rental._id)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Product
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Product Tab */}
        <TabsContent value="add-product" className="space-y-6">
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add New Rental Product
              </CardTitle>
              <CardDescription>
                Create a new product listing for your rental inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="bg-background border border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price per day (₹)</label>
                  <Input
                    placeholder="Enter daily rental price"
                    value={form.price}
                    type="number"
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="bg-background border border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your rental product..."
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="bg-background border border-border resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Images</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFiles}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-xs text-muted-foreground">
                      PNG, JPG, JPEG up to 10MB (Multiple files allowed)
                    </div>
                  </label>
                </div>
                {files.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {files.length} file(s) selected: {files.map(f => f.name).join(", ")}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleAdd} 
                disabled={uploading || !form.name || !form.description || !form.price || files.length === 0}
                className="w-full bg-admin-gradient hover:opacity-90 text-white shadow-admin transition-all duration-300"
                size="lg"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rental Product
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Order Management
              </CardTitle>
              <CardDescription>
                Track and manage all rental orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders yet. Orders will appear here once customers start renting.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <Card key={order._id} className="border border-border shadow-sm hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-lg">{order.customerName}</h4>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div>📧 {order.customerEmail}</div>
                              <div>📞 {order.customerPhone}</div>
                              <div>📅 {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</div>
                              <div className="font-medium text-primary">Total: ₹{order.totalAmount.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Contact Customer
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

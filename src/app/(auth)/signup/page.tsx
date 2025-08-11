import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminNavbar from "@/components/AdminNavbar";
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
  BarChart3,
  Users
} from "lucide-react";

interface Rental {
  _id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

export default function AdminDashboard() {
  const [rentals, setRentals] = useState<Rental[]>([
    {
      _id: "1",
      name: "Professional Camera",
      description: "High-quality DSLR camera perfect for events and photography",
      price: 500,
      images: []
    }
  ]);
  
  const [orders] = useState<Order[]>([
    {
      _id: "1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      startDate: "2024-01-15",
      endDate: "2024-01-20",
      totalAmount: 1500,
      status: "active"
    },
    {
      _id: "2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      startDate: "2024-01-10",
      endDate: "2024-01-12",
      totalAmount: 800,
      status: "completed"
    }
  ]);

  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentSection, setCurrentSection] = useState("dashboard");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleAdd = async () => {
    if (!form.name || !form.description || !form.price || files.length === 0) {
      alert("Please fill all fields and select images.");
      return;
    }
    
    setUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRental: Rental = {
        _id: Date.now().toString(),
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        images: files.map(file => URL.createObjectURL(file))
      };
      
      setRentals(prev => [newRental, ...prev]);
      setForm({ name: "", description: "", price: "" });
      setFiles([]);
      setUploading(false);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }, 1000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this rental?")) {
      setRentals(prev => prev.filter(r => r._id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const stats = {
    totalRentals: rentals.length,
    activeOrders: orders.filter(o => o.status === 'active').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    completedOrders: orders.filter(o => o.status === 'completed').length
  };

  const handleNavigation = (section: string) => {
    setCurrentSection(section);
    // You can add additional navigation logic here
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return renderDashboardContent();
      case "products":
        return renderProductsContent();
      case "orders":
        return renderOrdersContent();
      case "analytics":
        return renderAnalyticsContent();
      case "customers":
        return renderCustomersContent();
      default:
        return renderDashboardContent();
    }
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="admin-gradient-soft border-primary/20 shadow-admin hover:shadow-admin-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRentals}</div>
            <p className="text-xs text-muted-foreground">Available for rent</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">Currently rented</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedOrders}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your rental business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-muted-foreground">Professional Camera rented by John Doe</p>
              </div>
              <p className="text-xs text-muted-foreground">2 min ago</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Product added</p>
                <p className="text-xs text-muted-foreground">New inventory item added to catalog</p>
              </div>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Order completed</p>
                <p className="text-xs text-muted-foreground">Jane Smith returned camera equipment</p>
              </div>
              <p className="text-xs text-muted-foreground">3 hours ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductsContent = () => (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview">Inventory</TabsTrigger>
        <TabsTrigger value="add-product">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Current Inventory
            </CardTitle>
            <CardDescription>Manage all your rental products</CardDescription>
          </CardHeader>
          <CardContent>
            {rentals.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No products available. Add your first rental product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentals.map(rental => (
                  <Card key={rental._id} className="group overflow-hidden hover:shadow-admin transition-all hover:scale-[1.02]">
                    {rental.images && rental.images.length > 0 ? (
                      <img
                        src={rental.images[0]}
                        alt={rental.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
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
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="add-product">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Product
            </CardTitle>
            <CardDescription>Create a new rental product listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price per day (₹)</label>
                <Input
                  placeholder="Enter daily rental price"
                  value={form.price}
                  type="number"
                  onChange={e => setForm({ ...form, price: e.target.value })}
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
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="text-primary font-medium">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PNG, JPG, JPEG up to 10MB
                  </div>
                </label>
              </div>
              {files.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {files.length} file(s) selected
                </div>
              )}
            </div>

            <Button 
              onClick={handleAdd} 
              disabled={uploading || !form.name || !form.description || !form.price || files.length === 0}
              className="w-full admin-gradient hover:opacity-90 text-white shadow-admin"
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
                  Add Product
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const renderOrdersContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" />
          Order Management
        </CardTitle>
        <CardDescription>Track and manage all rental orders</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order._id} className="hover:shadow-md transition-all">
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
                        <div>📅 {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</div>
                        <div className="font-medium text-primary col-span-full">Total: ₹{order.totalAmount.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Contact</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderCustomersContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Customer Management
        </CardTitle>
        <CardDescription>Manage your customer relationships</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Customer management features coming soon</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar onNavigate={handleNavigation} currentSection={currentSection} />
      
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold admin-gradient bg-clip-text text-transparent">
            {currentSection === "dashboard" ? "Admin Dashboard" : 
             currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
          </h1>
          <p className="text-muted-foreground">
            {currentSection === "dashboard" ? "Manage your rental business efficiently" :
             currentSection === "products" ? "Manage your rental inventory" :
             currentSection === "orders" ? "Track and manage orders" :
             currentSection === "analytics" ? "Business insights and metrics" :
             "Manage customer relationships"}
          </p>
        </div>

        {/* Dynamic Content */}
        {renderContent()}
      </div>
    </div>
  );
}
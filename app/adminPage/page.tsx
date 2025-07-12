"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FaUser,
  FaList,
  FaChartLine,
  FaInfoCircle,
  FaCheck,
  FaTimes,
  FaShoppingBag,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Link from "next/link";
import { useSession } from "next-auth/react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Item {
  id: string;
  title: string;
  description?: string;
  category: string;
  size: string;
  condition: string;
  brand?: string;
  images: string[];
  pointValue: number;
  status: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminPanel() {
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { data: session } = useSession();

  const [admin, setAdmin] = useState({
    id: "admin1",
    email: "admin@rewear.com",
    name: "Admin User",
    points: 100,
    isAdmin: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Fetch pending items for approval
  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/items");
      if (response.ok) {
        const data = await response.json();
        setPendingItems(data.items);
      } else {
        console.error("Failed to fetch pending items");
      }
    } catch (error) {
      console.error("Error fetching pending items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const handleItemApproval = async (itemId: string, isApproved: boolean) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, isApproved }),
      });

      if (response.ok) {
        const data = await response.json();
        // Remove the item from pending items list since it's now approved/rejected
        setPendingItems((prev) => prev.filter((item) => item.id !== itemId));
        alert(data.message);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item approval:", error);
      alert("Failed to update item approval");
    } finally {
      setLoading(false);
    }
  };

  // Chart Data
  const chartData = {
    labels: ["Total Items", "Pending Approval", "Approved", "Rejected"],
    datasets: [
      {
        label: "Item Status",
        data: [pendingItems.length + 30, pendingItems.length, 25, 5], // Replace with actual data
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
        borderColor: ["#1d4ed8", "#d97706", "#047857", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Item Approval Statistics",
        font: { size: 18 },
        color: "#1f2937",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Items" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-700 to-green-800 text-white p-4 shadow-xl flex justify-between items-center">
        <div className="flex space-x-8">
          <Link
            href="/admin"
            className="flex items-center text-lg hover:text-yellow-200 transition"
          >
            <FaChartLine className="mr-2" /> Dashboard
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center text-lg hover:text-yellow-200 transition"
          >
            <FaList className="mr-2" /> Listings
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-yellow-300 transition">
              <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mr-4 bg-white text-gray-800">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        {/* Admin Details Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center">
            <FaUser className="mr-2" /> Admin Details
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src="https://i.pravatar.cc/100?img=1"
                alt={admin.name}
              />
              <AvatarFallback>
                {admin.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-gray-700">
                  <strong>ID:</strong> {admin.id}
                </p>
                <p className="text-gray-700">
                  <strong>Name:</strong> {admin.name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {admin.email}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Points:</strong> {admin.points}
                </p>
                <p className="text-gray-700">
                  <strong>Admin Status:</strong> {admin.isAdmin ? "Yes" : "No"}
                </p>
                <p className="text-gray-700">
                  <strong>Created At:</strong>{" "}
                  {new Date(admin.createdAt).toLocaleString()}
                </p>
                <p className="text-gray-700">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(admin.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Item Statistics
          </h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </section>

        {/* Items Tab */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
            <FaShoppingBag className="mr-2" /> Pending Items for Approval
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800"></div>
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending items for approval
            </div>
          ) : (
            <div className="grid gap-6">
              {pendingItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>
                          By {item.user.name} ({item.user.email})
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        Pending Approval
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Category:</strong> {item.category}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Size:</strong> {item.size}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Condition:</strong> {item.condition}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Point Value:</strong> {item.pointValue}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Submitted:</strong>{" "}
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Description:</strong> {item.description}
                          </p>
                        )}
                        {item.images && item.images.length > 0 && (
                          <div className="flex space-x-2 mt-2">
                            {item.images.slice(0, 3).map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`${item.title} ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-4">
                      <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleItemApproval(item.id, true)}
                        disabled={loading}
                      >
                        <FaCheck className="mr-2" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => handleItemApproval(item.id, false)}
                        disabled={loading}
                      >
                        <FaTimes className="mr-2" /> Reject
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => setSelectedItem(item)}
                          >
                            <FaInfoCircle className="mr-2" /> View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white p-6 rounded-xl shadow-lg">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-green-800">
                              Item Details: {selectedItem?.title}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedItem && (
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p>
                                    <strong>ID:</strong> {selectedItem.id}
                                  </p>
                                  <p>
                                    <strong>Title:</strong> {selectedItem.title}
                                  </p>
                                  <p>
                                    <strong>Category:</strong>{" "}
                                    {selectedItem.category}
                                  </p>
                                  <p>
                                    <strong>Size:</strong> {selectedItem.size}
                                  </p>
                                  <p>
                                    <strong>Condition:</strong>{" "}
                                    {selectedItem.condition}
                                  </p>
                                  <p>
                                    <strong>Point Value:</strong>{" "}
                                    {selectedItem.pointValue}
                                  </p>
                                  <p>
                                    <strong>Status:</strong>{" "}
                                    {selectedItem.status}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Owner:</strong>{" "}
                                    {selectedItem.user.name}
                                  </p>
                                  <p>
                                    <strong>Email:</strong>{" "}
                                    {selectedItem.user.email}
                                  </p>
                                  <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(
                                      selectedItem.createdAt
                                    ).toLocaleString()}
                                  </p>
                                  <p>
                                    <strong>Updated:</strong>{" "}
                                    {new Date(
                                      selectedItem.updatedAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              {selectedItem.description && (
                                <div>
                                  <p>
                                    <strong>Description:</strong>
                                  </p>
                                  <p className="text-gray-700 mt-1">
                                    {selectedItem.description}
                                  </p>
                                </div>
                              )}
                              {selectedItem.images &&
                                selectedItem.images.length > 0 && (
                                  <div>
                                    <p>
                                      <strong>Images:</strong>
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                      {selectedItem.images.map(
                                        (image, index) => (
                                          <img
                                            key={index}
                                            src={image}
                                            alt={`${selectedItem.title} ${
                                              index + 1
                                            }`}
                                            className="w-full h-32 object-cover rounded-lg"
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

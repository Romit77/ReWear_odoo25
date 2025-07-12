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
import { motion, AnimatePresence } from "framer-motion";

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
        data: [pendingItems.length + 30, pendingItems.length, 25, 5],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // emerald-500
          "rgba(245, 158, 11, 0.8)", // amber-500
          "rgba(59, 130, 246, 0.8)", // blue-500
          "rgba(239, 68, 68, 0.8)", // red-500
        ],
        borderColor: [
          "rgba(5, 150, 105, 1)", // emerald-600
          "rgba(217, 119, 6, 1)", // amber-600
          "rgba(29, 78, 216, 1)", // blue-600
          "rgba(220, 38, 38, 1)", // red-600
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { color: "#e5e7eb" } },
      title: {
        display: true,
        text: "Item Approval Statistics",
        font: { size: 18 },
        color: "#e5e7eb",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Number of Items", color: "#e5e7eb" },
        ticks: { color: "#e5e7eb" },
        grid: { color: "rgba(209, 213, 219, 0.1)" },
      },
      x: {
        ticks: { color: "#e5e7eb" },
        grid: { color: "rgba(209, 213, 219, 0.1)" },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900/95 backdrop-blur-sm text-gray-200">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-800/95 border-b border-gray-700/50 text-white p-4 shadow-xl flex justify-between items-center sticky top-0 z-50"
      >
        <div className="flex space-x-8">
          <Link
            href="/admin"
            className="flex items-center text-lg text-gray-300 hover:text-emerald-400 transition-all duration-300 group"
          >
            <FaChartLine className="mr-2 group-hover:text-emerald-400" />
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center text-lg text-gray-300 hover:text-emerald-400 transition-all duration-300 group"
          >
            <FaList className="mr-2 group-hover:text-emerald-400" />
            Listings
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-emerald-400 transition-all duration-300">
                <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  AD
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 mr-4 bg-gray-800/95 backdrop-blur-sm text-gray-200 border border-gray-700/50 rounded-xl shadow-xl">
            <DropdownMenuItem className="hover:bg-gray-700/50 hover:text-emerald-400 transition-all duration-300">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700/50 hover:text-emerald-400 transition-all duration-300">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-700/50 hover:text-red-400 transition-all duration-300">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.nav>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        {/* Admin Details Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50 mb-8"
        >
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4 flex items-center">
            <FaUser className="mr-2 text-emerald-400" /> Admin Details
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Avatar className="h-24 w-24 border-4 border-gray-700 shadow-lg">
                <AvatarImage src="https://i.pravatar.cc/100?img=1" alt={admin.name} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  {admin.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-gray-300"><strong>ID:</strong> {admin.id}</p>
                <p className="text-gray-300"><strong>Name:</strong> {admin.name}</p>
                <p className="text-gray-300"><strong>Email:</strong> {admin.email}</p>
              </div>
              <div>
                <p className="text-gray-300"><strong>Points:</strong> {admin.points}</p>
                <p className="text-gray-300"><strong>Admin Status:</strong> {admin.isAdmin ? "Yes" : "No"}</p>
                <p className="text-gray-300"><strong>Created At:</strong> {new Date(admin.createdAt).toLocaleString()}</p>
                <p className="text-gray-300"><strong>Last Updated:</strong> {new Date(admin.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Chart Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50 mb-8"
        >
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Item Statistics
          </h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.section>

        {/* Items Tab */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50"
        >
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 flex items-center">
            <FaShoppingBag className="mr-2 text-emerald-400" /> Pending Items for Approval
          </h2>

          {loading ? (
            <motion.div
              className="flex justify-center items-center h-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            </motion.div>
          ) : pendingItems.length === 0 ? (
            <motion.div
              className="text-center py-8 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No pending items for approval
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {pendingItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-700/50 hover:shadow-xl transition-all duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-gray-200">{item.title}</CardTitle>
                            <CardDescription className="text-gray-400">
                              By {item.user.name} ({item.user.email})
                            </CardDescription>
                          </div>
                          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none">
                            Pending Approval
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-2">
                              <strong>Category:</strong> {item.category}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                              <strong>Size:</strong> {item.size}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                              <strong>Condition:</strong> {item.condition}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                              <strong>Point Value:</strong> {item.pointValue}
                            </p>
                            <p className="text-sm text-gray-400 mb-2">
                              <strong>Submitted:</strong>{" "}
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            {item.description && (
                              <p className="text-sm text-gray-400 mb-2">
                                <strong>Description:</strong> {item.description}
                              </p>
                            )}
                            {item.images && item.images.length > 0 && (
                              <div className="flex space-x-2 mt-2">
                                {item.images.slice(0, 3).map((image, index) => (
                                  <motion.img
                                    key={index}
                                    src={image}
                                    alt={`${item.title} ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-700"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                              onClick={() => handleItemApproval(item.id, true)}
                              disabled={loading}
                            >
                              <FaCheck className="mr-2" /> Approve
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                              onClick={() => handleItemApproval(item.id, false)}
                              disabled={loading}
                            >
                              <FaTimes className="mr-2" /> Reject
                            </Button>
                          </motion.div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <FaInfoCircle className="mr-2" /> View Details
                                </Button>
                              </motion.div>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl bg-gray-800/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700/50">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                  Item Details: {selectedItem?.title}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedItem && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-4 mt-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-gray-300"><strong>ID:</strong> {selectedItem.id}</p>
                                      <p className="text-gray-300"><strong>Title:</strong> {selectedItem.title}</p>
                                      <p className="text-gray-300"><strong>Category:</strong> {selectedItem.category}</p>
                                      <p className="text-gray-300"><strong>Size:</strong> {selectedItem.size}</p>
                                      <p className="text-gray-300"><strong>Condition:</strong> {selectedItem.condition}</p>
                                      <p className="text-gray-300"><strong>Point Value:</strong> {selectedItem.pointValue}</p>
                                      <p className="text-gray-300"><strong>Status:</strong> {selectedItem.status}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-300"><strong>Owner:</strong> {selectedItem.user.name}</p>
                                      <p className="text-gray-300"><strong>Email:</strong> {selectedItem.user.email}</p>
                                      <p className="text-gray-300"><strong>Created:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</p>
                                      <p className="text-gray-300"><strong>Updated:</strong> {new Date(selectedItem.updatedAt).toLocaleString()}</p>
                                    </div>
                                  </div>
                                  {selectedItem.description && (
                                    <div>
                                      <p className="text-gray-300"><strong>Description:</strong></p>
                                      <p className="text-gray-400 mt-1">{selectedItem.description}</p>
                                    </div>
                                  )}
                                  {selectedItem.images && selectedItem.images.length > 0 && (
                                    <div>
                                      <p className="text-gray-300"><strong>Images:</strong></p>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                        {selectedItem.images.map((image, index) => (
                                          <motion.img
                                            key={index}
                                            src={image}
                                            alt={`${selectedItem.title} ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-700"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
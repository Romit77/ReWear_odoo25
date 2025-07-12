"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  MapPin,
  Calendar,
  User,
  Package,
  Coins,
  MessageCircle,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  Clock,
} from "lucide-react";

// Types based on your schema
interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
}

interface ProductDetailPageProps {
  item?: Item;
  currentUser?: User;
  userItems?: Item[];
}

export default function ProductDetailPage({
  item: initialItem,
  currentUser: initialCurrentUser,
  userItems: initialUserItems,
}: ProductDetailPageProps) {
  // Mock data fallback for demo
  const mockItem: Item = {
    id: "1",
    title: "Nike Air Max Sneakers",
    description:
      "High-quality sneakers in excellent condition. Perfect for everyday use and sports activities. These Nike Air Max shoes feature premium materials and comfortable cushioning.",
    category: "clothing",
    size: "M",
    condition: "excellent",
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&h=500&fit=crop",
    ],
    pointValue: 85,
    status: "available",
    isApproved: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    userId: "user1",
    user: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      points: 120,
      isAdmin: false,
      createdAt: new Date("2023-06-10"),
      updatedAt: new Date("2024-01-20"),
    },
  };

  const mockCurrentUser: User = {
    id: "currentUser",
    name: "John Doe",
    email: "john@example.com",
    points: 75,
    isAdmin: false,
    createdAt: new Date("2023-08-01"),
    updatedAt: new Date("2024-01-20"),
  };

  const mockUserItems: Item[] = [
    {
      id: "2",
      title: "H&M Cotton T-Shirt",
      description: "Comfortable cotton t-shirt",
      category: "clothing",
      size: "L",
      condition: "good",
      brand: "H&M",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
      ],
      pointValue: 20,
      status: "available",
      isApproved: true,
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
      userId: "currentUser",
      user: mockCurrentUser,
    },
    {
      id: "3",
      title: "Zara Summer Dress",
      description: "Beautiful summer dress",
      category: "clothing",
      size: "M",
      condition: "excellent",
      brand: "Zara",
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop",
      ],
      pointValue: 35,
      status: "available",
      isApproved: true,
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-08"),
      userId: "currentUser",
      user: mockCurrentUser,
    },
    {
      id: "4",
      title: "Adidas Running Shoes",
      description: "Great running shoes",
      category: "clothing",
      size: "M",
      condition: "good",
      brand: "Adidas",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
      ],
      pointValue: 40,
      status: "available",
      isApproved: true,
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-05"),
      userId: "currentUser",
      user: mockCurrentUser,
    },
    {
      id: "5",
      title: "Uniqlo Wool Sweater",
      description: "Warm wool sweater",
      category: "clothing",
      size: "L",
      condition: "excellent",
      brand: "Uniqlo",
      images: [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=200&fit=crop",
      ],
      pointValue: 50,
      status: "available",
      isApproved: true,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
      userId: "currentUser",
      user: mockCurrentUser,
    },
  ];

  const [item] = useState<Item>(initialItem || mockItem);
  const [currentUser] = useState<User>(initialCurrentUser || mockCurrentUser);
  const [userItems] = useState<Item[]>(initialUserItems || mockUserItems);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [swapMethod, setSwapMethod] = useState<"points" | "item">("points");
  const [selectedItemForSwap, setSelectedItemForSwap] = useState<string | null>(
    null
  );
  const [swapMessage, setSwapMessage] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  const handleSwapSubmit = async () => {
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      // Calculate points to use
      let pointsToUse = 0;
      if (swapMethod === "points") {
        pointsToUse = item.pointValue;
      } else if (selectedItemForSwap) {
        const selectedItem = userItems.find(
          (i) => i.id === selectedItemForSwap
        );
        if (selectedItem) {
          pointsToUse = Math.max(0, item.pointValue - selectedItem.pointValue);
        }
      }

      // Check if user has enough points
      if (pointsToUse > currentUser.points) {
        alert("You do not have enough points for this swap!");
        setIsSubmitting(false);
        return;
      }

      // Create swap request
      const swapData = {
        itemId: item.id,
        requesterId: currentUser.id,
        ownerId: item.userId,
        pointsUsed: pointsToUse,
        message: swapMessage,
        status: "pending",
        ...(swapMethod === "item" && selectedItemForSwap
          ? {
              offeredItemId: selectedItemForSwap,
            }
          : {}),
      };

      // Here you would make API call to create swap
      // const response = await fetch('/api/swaps', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(swapData)
      // });

      console.log("Swap request:", swapData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Swap request sent successfully!");
      setShowSwapModal(false);
      setSwapMessage("");
      setSelectedItemForSwap(null);
    } catch (error) {
      console.error("Error creating swap:", error);
      alert("Failed to create swap request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "new":
        return "bg-green-100 text-green-800";
      case "like-new":
        return "bg-green-100 text-green-800";
      case "excellent":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canAffordPointsSwap = currentUser.points >= item.pointValue;
  const isOwnItem = currentUser.id === item.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-square relative">
                {item.images.length > 0 ? (
                  <img
                    src={item.images[selectedImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    No Image Available
                  </div>
                )}

                {/* Image Navigation */}
                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {selectedImageIndex + 1} / {item.images.length}
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-border ${
                      selectedImageIndex === index
                        ? "border-purple-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Package className="h-4 w-4 mr-1" />
                      {item.category}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1 text-2xl font-bold text-purple-600">
                    <Coins className="h-6 w-6" />
                    <span>{item.pointValue}</span>
                  </div>
                  <span className="text-sm text-gray-500">points</span>
                </div>
              </div>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                    item.condition
                  )}`}
                >
                  {item.condition}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  Size: {item.size}
                </span>
                {item.brand && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {item.brand}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description || "No description provided for this item."}
                </p>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Seller Information
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.user.name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Coins className="h-3 w-3 mr-1" />
                      {item.user.points} points
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {isOwnItem ? (
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">This is your item</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                      Edit Item
                    </button>
                    <button className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Item
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Your Points:
                    </span>
                    <span className="flex items-center text-lg font-bold text-purple-600">
                      <Coins className="h-5 w-5 mr-1" />
                      {currentUser.points}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowSwapModal(true)}
                    disabled={!canAffordPointsSwap}
                    className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                      canAffordPointsSwap
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Request Swap</span>
                  </button>

                  {!canAffordPointsSwap && (
                    <p className="text-sm text-red-600 text-center">
                      You need {item.pointValue - currentUser.points} more
                      points to swap
                    </p>
                  )}

                  <button className="w-full py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="h-5 w-5" />
                    <span>Share Item</span>
                  </button>
                </div>
              )}
            </div>

            {/* Previous Listings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Your Available Items
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {userItems.slice(0, 4).map((userItem) => (
                  <div
                    key={userItem.id}
                    className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-200 rounded-md mb-2 overflow-hidden">
                      {userItem.images.length > 0 ? (
                        <img
                          src={userItem.images[0]}
                          alt={userItem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm text-gray-800 truncate">
                      {userItem.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {userItem.condition}
                      </span>
                      <span className="text-xs font-medium text-purple-600">
                        {userItem.pointValue} pts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Request Swap
                </h2>
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Item Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                    {item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Coins className="h-3 w-3 mr-1" />
                      {item.pointValue} points
                    </p>
                  </div>
                </div>
              </div>

              {/* Swap Method Selection */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Swap Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="swapMethod"
                      value="points"
                      checked={swapMethod === "points"}
                      onChange={(e) =>
                        setSwapMethod(e.target.value as "points" | "item")
                      }
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">
                      Pay with points ({item.pointValue} points)
                    </span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="swapMethod"
                      value="item"
                      checked={swapMethod === "item"}
                      onChange={(e) =>
                        setSwapMethod(e.target.value as "points" | "item")
                      }
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">
                      Trade with your item + points difference
                    </span>
                  </label>
                </div>
              </div>

              {/* Item Selection for Trade */}
              {swapMethod === "item" && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Select Item to Trade
                  </h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {userItems.map((userItem) => {
                      const pointDifference =
                        item.pointValue - userItem.pointValue;
                      const isSelected = selectedItemForSwap === userItem.id;

                      return (
                        <label
                          key={userItem.id}
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="itemForSwap"
                            value={userItem.id}
                            checked={isSelected}
                            onChange={(e) =>
                              setSelectedItemForSwap(e.target.value)
                            }
                            className="text-purple-600"
                          />
                          <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
                            {userItem.images.length > 0 ? (
                              <img
                                src={userItem.images[0]}
                                alt={userItem.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {userItem.title}
                            </p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {userItem.pointValue} pts
                              </span>
                              {pointDifference > 0 && (
                                <span className="text-red-600">
                                  +{pointDifference} pts needed
                                </span>
                              )}
                              {pointDifference < 0 && (
                                <span className="text-green-600">
                                  You get {Math.abs(pointDifference)} pts back
                                </span>
                              )}
                              {pointDifference === 0 && (
                                <span className="text-gray-600">
                                  Even trade
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Points Calculation */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Swap Summary</h3>
                {swapMethod === "points" ? (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Item cost:</span>
                      <span>{item.pointValue} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your balance:</span>
                      <span>{currentUser.points} points</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Balance after swap:</span>
                      <span>{currentUser.points - item.pointValue} points</span>
                    </div>
                  </div>
                ) : (
                  selectedItemForSwap && (
                    <div className="space-y-1 text-sm">
                      {(() => {
                        const selectedItem = userItems.find(
                          (i) => i.id === selectedItemForSwap
                        );
                        const pointDifference =
                          item.pointValue - (selectedItem?.pointValue || 0);
                        const finalPointsNeeded = Math.max(0, pointDifference);

                        return (
                          <>
                            <div className="flex justify-between">
                              <span>Item cost:</span>
                              <span>{item.pointValue} points</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Your item value:</span>
                              <span>{selectedItem?.pointValue} points</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Points needed:</span>
                              <span>{finalPointsNeeded} points</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Your balance:</span>
                              <span>{currentUser.points} points</span>
                            </div>
                            <div className="flex justify-between font-medium border-t pt-1">
                              <span>Balance after swap:</span>
                              <span>
                                {currentUser.points - finalPointsNeeded} points
                              </span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )
                )}
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  placeholder="Add a message to the seller..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSwapSubmit}
                  disabled={
                    isSubmitting ||
                    (swapMethod === "item" && !selectedItemForSwap)
                  }
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isSubmitting ||
                    (swapMethod === "item" && !selectedItemForSwap)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Send Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Validation Message */}
              {swapMethod === "item" && !selectedItemForSwap && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please select an item to trade</span>
                </div>
              )}

              {(() => {
                let pointsNeeded = 0;
                if (swapMethod === "points") {
                  pointsNeeded = item.pointValue;
                } else if (selectedItemForSwap) {
                  const selectedItem = userItems.find(
                    (i) => i.id === selectedItemForSwap
                  );
                  if (selectedItem) {
                    pointsNeeded = Math.max(
                      0,
                      item.pointValue - selectedItem.pointValue
                    );
                  }
                }

                return pointsNeeded > currentUser.points ? (
                  <div className="mt-3 flex items-center space-x-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Insufficient points for this swap</span>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

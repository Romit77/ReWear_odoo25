"use client";

import { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Camera, Upload, Tag, Package, Shirt, Ruler, Star, Type } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AddItemPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  console.log("User ID:", userId);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    tags: "",
    imageUrl: "",
  });

  useEffect(() => {
    console.log("Component mounted, checking environment:", process.env.UPLOADTHING_API_KEY ? "Loaded" : "Not loaded");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (res: any) => {
    console.log("Upload response:", res);
    if (res && res.length > 0) {
      setFormData({ ...formData, imageUrl: res[0].url });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to add an item.");
      return;
    }
    if (!formData.imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }
    if (!formData.title || !formData.description || !formData.category || !formData.type || !formData.size || !formData.condition || !formData.tags) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Item added successfully:", data);
        alert("Item listed successfully!");
        setFormData({
          title: "",
          description: "",
          category: "",
          type: "",
          size: "",
          condition: "",
          tags: "",
          imageUrl: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Error adding item:", errorData);
        alert(`Failed to list item: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit item. Check console for details.");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900/95 backdrop-blur-sm">
      {/* Header Section */}
      <div className="bg-gray-800/95 border-b border-gray-700/50 py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
              List Your Item
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Share your pre-loved fashion with the ReWear community. Upload your item and help promote sustainable fashion!
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Image Upload Section */}
            <div className="p-8 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-b border-gray-700/50">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Upload Your Item Photo</h2>
                <p className="text-gray-400 mb-6">Show off your item with a clear, well-lit photo</p>

                <div className="bg-gray-900/50 rounded-xl p-6 border-2 border-dashed border-gray-600 hover:border-emerald-400 transition-all duration-300">
                  <UploadButton<OurFileRouter, any>
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(error: Error) => {
                      console.error("Upload error:", error);
                      alert(`Error! ${error.message}`);
                    }}
                    appearance={{
                      button:
                        "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105",
                      allowedContent: "text-gray-400 text-sm mt-2",
                    }}
                  />

                  {formData.imageUrl && (
                    <div className="mt-6">
                      <img
                        src={formData.imageUrl}
                        alt="Uploaded item"
                        className="w-40 h-40 object-cover rounded-xl mx-auto border-4 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      />
                      <p className="text-emerald-400 text-sm mt-2 font-medium">✓ Photo uploaded successfully!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300 font-medium">
                  <Type className="w-4 h-4 mr-2 text-emerald-400" />
                  Item Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Denim Jacket"
                  className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all duration-300 outline-none hover:bg-gray-800/50"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300 font-medium">
                  <Package className="w-4 h-4 mr-2 text-emerald-400" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item's style, fit, and any special features..."
                  rows={4}
                  className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all duration-300 outline-none resize-none hover:bg-gray-800/50"
                  required
                />
              </div>

              {/* Category & Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300 font-medium">
                    <Shirt className="w-4 h-4 mr-2 text-emerald-400" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 transition-all duration-300 outline-none hover:bg-gray-800/50"
                    required
                  >
                    <option value="" className="bg-gray-900">Select Category</option>
                    <option value="Tops" className="bg-gray-900">Tops</option>
                    <option value="Bottoms" className="bg-gray-900">Bottoms</option>
                    <option value="Dresses" className="bg-gray-900">Dresses</option>
                    <option value="Outerwear" className="bg-gray-900">Outerwear</option>
                    <option value="Accessories" className="bg-gray-900">Accessories</option>
                    <option value="Shoes" className="bg-gray-900">Shoes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-300 font-medium">
                    <Tag className="w-4 h-4 mr-2 text-emerald-400" />
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., T-shirt, Jeans, Sneakers"
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all duration-300 outline-none hover:bg-gray-800/50"
                    required
                  />
                </div>
              </div>

              {/* Size & Condition Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-300 font-medium">
                    <Ruler className="w-4 h-4 mr-2 text-emerald-400" />
                    Size
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 transition-all duration-300 outline-none hover:bg-gray-800/50"
                    required
                  >
                    <option value="" className="bg-gray-900">Select Size</option>
                    <option value="XS" className="bg-gray-900">XS</option>
                    <option value="S" className="bg-gray-900">S</option>
                    <option value="M" className="bg-gray-900">M</option>
                    <option value="L" className="bg-gray-900">L</option>
                    <option value="XL" className="bg-gray-900">XL</option>
                    <option value="XXL" className="bg-gray-900">XXL</option>
                    <option value="One Size" className="bg-gray-900">One Size</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-300 font-medium">
                    <Star className="w-4 h-4 mr-2 text-emerald-400" />
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 transition-all duration-300 outline-none hover:bg-gray-800/50"
                    required
                  >
                    <option value="" className="bg-gray-900">Select Condition</option>
                    <option value="Like New" className="bg-gray-900">Like New</option>
                    <option value="Excellent" className="bg-gray-900">Excellent</option>
                    <option value="Good" className="bg-gray-900">Good</option>
                    <option value="Fair" className="bg-gray-900">Fair</option>
                    <option value="Well-loved" className="bg-gray-900">Well-loved</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-300 font-medium">
                  <Tag className="w-4 h-4 mr-2 text-emerald-400" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., vintage, boho, summer, casual (comma-separated)"
                  className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-gray-200 placeholder-gray-500 transition-all duration-300 outline-none hover:bg-gray-800/50"
                  required
                />
                <p className="text-sm text-gray-400">Add relevant tags to help others find your item</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  List My Item
                </button>
                <p className="text-center text-gray-400 text-sm mt-3">
                  By listing your item, you agree to our community guidelines
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
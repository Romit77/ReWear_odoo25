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
          userId: userId 
        })
        });

        if(response.ok) {
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
            imageUrl: ""
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
    <div className="min-h-screen bg-green-50">
      {/* Header Section */}
      <div className="bg-white border-b border-green-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-700 mb-4">List Your Item</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Share your pre-loved fashion with the ReWear community. Upload your item and help promote sustainable fashion!
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Image Upload Section */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-b border-green-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Your Item Photo</h2>
                <p className="text-gray-600 mb-6">Show off your item with a clear, well-lit photo</p>
                
                <div className="bg-white rounded-xl p-6 border-2 border-dashed border-green-300 hover:border-green-400 transition-colors">
                  <UploadButton<OurFileRouter, any>
                    endpoint="imageUploader"
                    onClientUploadComplete={handleImageUpload}
                    onUploadError={(error: Error) => {
                      console.error("Upload error:", error);
                      alert(`Error! ${error.message}`);
                    }}
                    appearance={{
                      button: "bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full transition-colors",
                      allowedContent: "text-gray-500 text-sm mt-2"
                    }}
                  />
                  
                  {formData.imageUrl && (
                    <div className="mt-6">
                      <img 
                        src={formData.imageUrl} 
                        alt="Uploaded item" 
                        className="w-40 h-40 object-cover rounded-xl mx-auto border-4 border-green-200 shadow-md" 
                      />
                      <p className="text-green-600 text-sm mt-2 font-medium">✓ Photo uploaded successfully!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              
              {/* Title */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Type className="w-4 h-4 mr-2 text-green-600" />
                  Item Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Denim Jacket"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Package className="w-4 h-4 mr-2 text-green-600" />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item's style, fit, and any special features..."
                  rows={4}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                  required
                />
              </div>

              {/* Category & Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Shirt className="w-4 h-4 mr-2 text-green-600" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Shoes">Shoes</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Tag className="w-4 h-4 mr-2 text-green-600" />
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., T-shirt, Jeans, Sneakers"
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Size & Condition Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Ruler className="w-4 h-4 mr-2 text-green-600" />
                    Size
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white"
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="One Size">One Size</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Star className="w-4 h-4 mr-2 text-green-600" />
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-white"
                    required
                  >
                    <option value="">Select Condition</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Well-loved">Well-loved</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Tag className="w-4 h-4 mr-2 text-green-600" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., vintage, boho, summer, casual (comma-separated)"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                  required
                />
                <p className="text-sm text-gray-500">Add relevant tags to help others find your item</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  List My Item
                </button>
                <p className="text-center text-gray-500 text-sm mt-3">
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
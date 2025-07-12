"use client";

import { useEffect, useState } from "react";
// Update the import path if necessary, e.g.:
import Navbar from "./Navbar";
// Or ensure './ui/navbar.tsx' exists and exports Navbar
// Enhanced Navbar Component with Dark Theme

import Head from "next/head";

// Mock product data
const products = [
  {
    id: 1,
    name: "Vintage Leather Jacket",
    points: 85,
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    condition: "Excellent",
    size: "M",
    brand: "Vintage Collection",
  },
  {
    id: 2,
    name: "Designer Silk Dress",
    points: 120,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    condition: "Like New",
    size: "S",
    brand: "Elegance Co",
  },
  {
    id: 3,
    name: "Comfort Fit Jeans",
    points: 45,
    category: "Bottoms",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
    condition: "Good",
    size: "L",
    brand: "Denim Plus",
  },
  {
    id: 4,
    name: "Statement Necklace",
    points: 25,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
    condition: "Excellent",
    size: "One Size",
    brand: "Artisan Craft",
  },
  {
    id: 5,
    name: "Wool Coat",
    points: 95,
    category: "Tops",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    condition: "Very Good",
    size: "M",
    brand: "Winter Warmth",
  },
  {
    id: 6,
    name: "Summer Sundress",
    points: 35,
    category: "Dresses",
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    condition: "Good",
    size: "S",
    brand: "Sunny Days",
  },
];

const categories = [
  { name: "Tops", icon: "👕", count: 156 },
  { name: "Bottoms", icon: "👖", count: 89 },
  { name: "Dresses", icon: "👗", count: 67 },
  { name: "Accessories", icon: "💍", count: 234 },
];

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentFeatured, setCurrentFeatured] = useState(0);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatured((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  type Product = {
    id: number;
    name: string;
    points: number;
    category: string;
    image: string;
    condition: string;
    size: string;
    brand: string;
  };

  const ProductCard: React.FC<{ product: Product; index: number }> = ({
    product,
    index,
  }) => (
    <>
      <div
        className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 border border-gray-700/50"
        style={{
          animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
        }}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {product.points} pts
          </div>
          <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
            {product.condition}
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-white text-lg mb-1 group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h4>
          <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-medium">
              Size: {product.size}
            </span>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Swap Now
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
      <Head>
        <title>ReWear - Community Clothing Exchange</title>
        <meta name="description" content="Swap clothes, save the planet!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      <main className="container mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center animate-fadeInScale">
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ReWear
              </span>
            </h1>
            <h2 className="text-3xl font-semibold text-gray-300 mb-6">
              Sustainable Fashion Exchange
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Transform your wardrobe while helping the planet. Trade, earn
              points, and discover amazing pre-loved fashion.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold">
              Start Swapping
            </button>
            <button className="bg-transparent border-2 border-emerald-500 text-emerald-400 px-8 py-4 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105 font-semibold">
              Browse Items
            </button>
            <button className="bg-transparent border-2 border-teal-500 text-teal-400 px-8 py-4 rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300 transform hover:scale-105 font-semibold">
              List an Item
            </button>
          </div>
        </section>

        {/* Featured Items Carousel */}
        <section className="animate-fadeInScale">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Featured Items
            </span>
          </h3>
          <div className="relative max-w-md mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    index === currentFeatured
                      ? "opacity-100 translate-x-0"
                      : index < currentFeatured
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h4 className="text-2xl font-bold mb-2">
                        {product.name}
                      </h4>
                      <p className="text-emerald-400 font-semibold text-lg">
                        {product.points} Points
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeatured(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentFeatured ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="animate-fadeInScale">
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Categories
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-gray-800/70 transition-all duration-500 cursor-pointer border border-gray-700/50 hover:border-emerald-500/50 ${
                  selectedCategory === category.name
                    ? "ring-2 ring-emerald-500"
                    : ""
                }`}
                onClick={() => setSelectedCategory(category.name)}
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
                  {category.name}
                </h4>
                <p className="text-gray-400 text-sm">{category.count} items</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product Listings */}
        <section className="animate-fadeInScale">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </span>
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedCategory === cat.name
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="animate-fadeInScale">
          <div className="bg-gradient-to-r from-emerald-800/50 to-teal-800/50 rounded-3xl p-8 backdrop-blur-sm border border-emerald-700/30">
            <h3 className="text-3xl font-bold text-center mb-8 text-white">
              Community Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="animate-pulse-slow">
                <div className="text-4xl font-bold text-emerald-400 mb-2">
                  2,847
                </div>
                <div className="text-gray-300">Items Swapped</div>
              </div>
              <div className="animate-pulse-slow">
                <div className="text-4xl font-bold text-teal-400 mb-2">
                  1,234
                </div>
                <div className="text-gray-300">Active Members</div>
              </div>
              <div className="animate-pulse-slow">
                <div className="text-4xl font-bold text-emerald-400 mb-2">
                  156kg
                </div>
                <div className="text-gray-300">CO₂ Saved</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

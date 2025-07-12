"use client";

import { useState, useEffect } from "react";
import { Item } from "@/types";
import { ChevronDown, ChevronUp, Search, ShoppingCart } from "lucide-react";

interface ShopPageProps {
  initialItems?: Item[];
}

export default function ShopPage({ initialItems = [] }: ShopPageProps) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [filteredItems, setFilteredItems] = useState<Item[]>(initialItems);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // UI states
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [sizeExpanded, setSizeExpanded] = useState(true);
  const [conditionExpanded, setConditionExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [
    items,
    selectedCategories,
    selectedSizes,
    selectedConditions,
    priceRange,
    searchTerm,
    sortBy,
  ]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category)
      );
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((item) => selectedSizes.includes(item.size));
    }

    // Filter by conditions
    if (selectedConditions.length > 0) {
      filtered = filtered.filter((item) =>
        selectedConditions.includes(item.condition)
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (item) =>
        item.pointValue >= priceRange[0] && item.pointValue <= priceRange[1]
    );

    // Sort items
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "price-low":
        filtered.sort((a, b) => a.pointValue - b.pointValue);
        break;
      case "price-high":
        filtered.sort((a, b) => b.pointValue - a.pointValue);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredItems(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleConditionChange = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedConditions([]);
    setPriceRange([0, 1000]);
    setSearchTerm("");
  };

  // Extract unique values for filters
  const categories = [...new Set(items.map((item) => item.category))];
  const sizes = [...new Set(items.map((item) => item.size))];
  const conditions = [...new Set(items.map((item) => item.condition))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-200 to-orange-300 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Shop</h1>
          <nav className="text-gray-600">
            <span>Home</span> / <span className="text-gray-800">Shop</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <button
                  onClick={() => setCategoryExpanded(!categoryExpanded)}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
                >
                  CATEGORY
                  {categoryExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {categoryExpanded && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <button
                  onClick={() => setSizeExpanded(!sizeExpanded)}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
                >
                  SIZE
                  {sizeExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {sizeExpanded && (
                  <div className="space-y-2">
                    {sizes.map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeChange(size)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 uppercase">{size}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Conditions */}
              <div className="mb-6">
                <button
                  onClick={() => setConditionExpanded(!conditionExpanded)}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
                >
                  CONDITION
                  {conditionExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {conditionExpanded && (
                  <div className="space-y-2">
                    {conditions.map((condition) => (
                      <label
                        key={condition}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedConditions.includes(condition)}
                          onChange={() => handleConditionChange(condition)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 capitalize">
                          {condition}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <button
                  onClick={() => setPriceExpanded(!priceExpanded)}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3"
                >
                  PRICE (POINTS)
                  {priceExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {priceExpanded && (
                  <div className="space-y-4">
                    <div className="px-3">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                    <button
                      onClick={() => setPriceRange([0, 1000])}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Filter Price
                    </button>
                  </div>
                )}
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <span className="text-gray-600">Show</span>
                <div className="flex space-x-2">
                  {[9, 12, 18, 24].map((num) => (
                    <button
                      key={num}
                      onClick={() => setItemsPerPage(num)}
                      className={`px-3 py-1 rounded ${
                        itemsPerPage === num
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredItems.length} of {items.length} items
              </p>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                  >
                    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.slice(0, itemsPerPage).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-sm">
                        {item.pointValue} pts
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 truncate">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                        <span className="capitalize">{item.category}</span>
                        <span className="uppercase">{item.size}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span className="capitalize">{item.condition}</span>
                        {item.brand && <span>{item.brand}</span>}
                      </div>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>Request Swap</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

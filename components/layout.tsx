"use client";

import { ReactNode } from "react";
import { Search, ShoppingCart, User } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold text-gray-800">E-store</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                About
              </a>
              <a href="/shop" className="text-gray-800 font-medium">
                Shop
              </a>
              <a
                href="/t-shirt"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                T-shirt
              </a>
              <a
                href="/hoodies"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Hoodies
              </a>
              <a
                href="/oversized"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Oversized
              </a>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-xl font-bold">E-store</span>
              </div>
              <p className="text-gray-400">
                Your trusted marketplace for quality clothing and accessories.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className="hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/shop?category=t-shirts"
                    className="hover:text-white transition-colors"
                  >
                    T-Shirts
                  </a>
                </li>
                <li>
                  <a
                    href="/shop?category=hoodies"
                    className="hover:text-white transition-colors"
                  >
                    Hoodies
                  </a>
                </li>
                <li>
                  <a
                    href="/shop?category=oversized"
                    className="hover:text-white transition-colors"
                  >
                    Oversized
                  </a>
                </li>
                <li>
                  <a
                    href="/shop?category=accessories"
                    className="hover:text-white transition-colors"
                  >
                    Accessories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 E-store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

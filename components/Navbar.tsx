"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

// Enhanced Navbar Component with Dark Theme and Proper Authentication
export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Proper NextAuth session handling
  const { data: session } = useSession();
  
  console.log("Session Data:", session);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with enhanced styling */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              ReWear
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="relative group text-gray-300 hover:text-emerald-400 transition-all duration-300 font-medium">
              Browse
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/upload" className="relative group text-gray-300 hover:text-emerald-400 transition-all duration-300 font-medium">
              Upload
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {session?.user?.isAdmin && (
              <Link href="/admin" className="relative group text-gray-300 hover:text-emerald-400 transition-all duration-300 font-medium">
                Admin
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-gray-300 hover:text-emerald-400 p-2 rounded-lg hover:bg-gray-800 transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* User Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-semibold text-sm">
                        {session.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
                      <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-emerald-900/20 to-teal-900/20">
                        <div className="text-white font-medium">
                          {session.user?.name || "My Account"}
                        </div>
                        <div className="text-gray-400 text-sm">Premium Member</div>
                      </div>
                      <div className="py-2">
                        <Link href="/profile" className="flex items-center px-4 py-3 text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-all duration-300 group">
                          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-emerald-600 transition-all duration-300">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">Profile</div>
                            <div className="text-xs text-gray-500">Manage your account</div>
                          </div>
                        </Link>
                        <Link href="/add-item" className="flex items-center px-4 py-3 text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50 transition-all duration-300 group">
                          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-emerald-600 transition-all duration-300">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">Add Item</div>
                            <div className="text-xs text-gray-500">List something new</div>
                          </div>
                        </Link>
                        {session?.user?.isAdmin && (
                          <Link href="/adminPage" className="block px-4 py-2 text-gray-300 hover:text-emerald-400 hover:bg-gray-800 rounded-lg transition-all duration-300">
                            Admin
                          </Link>
                        )}
                        <div className="border-t border-gray-700/50 mt-2 pt-2">
                          <button 
                            onClick={() => signOut()}
                            className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-300 group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-red-600 transition-all duration-300">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Sign Out</div>
                              <div className="text-xs text-gray-500">See you later!</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link href="/login">
                  <button className="text-gray-300 hover:text-emerald-400 px-4 py-2 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium">
                    Login
                  </button>
                </Link>
                {/* Sign Up Button */}
                <Link href="/register">
                  <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && session && (
          <div className="md:hidden border-t border-gray-800 mt-4 pt-4 pb-4">
            <div className="space-y-2">
              <Link href="/browse" className="block px-4 py-2 text-gray-300 hover:text-emerald-400 hover:bg-gray-800 rounded-lg transition-all duration-300">
                Browse
              </Link>
              <Link href="/upload" className="block px-4 py-2 text-gray-300 hover:text-emerald-400 hover:bg-gray-800 rounded-lg transition-all duration-300">
                Upload
              </Link>
              {session?.user?.isAdmin && (
                <Link href="/admin" className="block px-4 py-2 text-gray-300 hover:text-emerald-400 hover:bg-gray-800 rounded-lg transition-all duration-300">
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
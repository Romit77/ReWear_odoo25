// app/shop/item/[id]/not-found.tsx

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function ItemNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-6">
          <ShoppingBag className="h-24 w-24 mx-auto" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Item Not Found
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The item you're looking for doesn't exist, has been removed, or is no
          longer available for swap.
        </p>

        <div className="space-y-4">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Shop</span>
          </Link>

          <div className="block">
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

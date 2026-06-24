'use client';

import { useState } from 'react';
import { Heart, Package, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CustomerWishlistPage() {
  // Placeholder for future implementation
  const [wishlist] = useState([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Wishlist
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Save your favorite products for later
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Start adding products you love to your wishlist
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="h-5 w-5" />
          Browse Products
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Loader2, Package } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // For now, using mock data
      const mockProducts = [
        {
          id: 1,
          name: 'Premium Wireless Headphones',
          description: 'High-quality sound with noise cancellation',
          price: 2999,
          mrp: 4999,
          sellingPrice: 2999,
          resellerProfit: 500,
          stock: 25,
          imageUrl: 'https://via.placeholder.com/300',
          category: 'Electronics',
        },
        {
          id: 2,
          name: 'Smart Fitness Watch',
          description: 'Track your fitness goals with style',
          price: 1999,
          mrp: 3499,
          sellingPrice: 1999,
          resellerProfit: 350,
          stock: 8,
          imageUrl: 'https://via.placeholder.com/300',
          category: 'Electronics',
        },
        {
          id: 3,
          name: 'Portable Bluetooth Speaker',
          description: 'Powerful sound in a compact design',
          price: 1499,
          mrp: 2499,
          sellingPrice: 1499,
          resellerProfit: 250,
          stock: 0,
          imageUrl: 'https://via.placeholder.com/300',
          category: 'Electronics',
        },
        {
          id: 4,
          name: 'USB-C Charging Cable (3-Pack)',
          description: 'Fast charging, durable braided cables',
          price: 599,
          mrp: 999,
          sellingPrice: 599,
          resellerProfit: 100,
          stock: 50,
          imageUrl: 'https://via.placeholder.com/300',
          category: 'Accessories',
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(mockProducts);
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Products
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Browse and share products with your customers
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Living</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Results Count */}
            <span className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                source="product_listing"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              {searchQuery ? `No products match "${searchQuery}"` : 'No products available at the moment'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

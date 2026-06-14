'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, TrendingUp } from 'lucide-react';
import ProductSaveButton from './ProductSaveButton';
import ProductShareButton from './ProductShareButton';
import { trackProductClick } from '@/lib/productTracking';

export default function ProductCard({ product, source = 'product_listing' }) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const productUrl = `${window.location.origin}/products/${product.id}`;

  const handleProductClick = async () => {
    // Track click
    await trackProductClick(product.id, source);
    
    // Navigate to product detail
    router.push(`/products/${product.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Product Image */}
      <div 
        className="relative aspect-square bg-gray-100 dark:bg-gray-700 cursor-pointer overflow-hidden group"
        onClick={handleProductClick}
      >
        {product.imageUrl ? (
          <>
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 animate-pulse" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Stock Badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Only {product.stock} left
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
              Out of Stock
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <ProductSaveButton 
            productId={product.id}
            source={source}
          />
          <ProductShareButton
            productId={product.id}
            productName={product.name}
            productImage={product.imageUrl}
            productUrl={productUrl}
            source={source}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 
          className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={handleProductClick}
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(product.sellingPrice || product.price)}
          </span>
          {product.mrp && product.mrp > (product.sellingPrice || product.price) && (
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {Math.round(((product.mrp - (product.sellingPrice || product.price)) / product.mrp) * 100)}% off
              </span>
            </>
          )}
        </div>

        {/* Reseller Profit (if applicable) */}
        {product.resellerProfit && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold mb-3">
            <TrendingUp className="h-4 w-4" />
            <span>Earn {formatPrice(product.resellerProfit)} per sale</span>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleProductClick}
          disabled={product.stock === 0}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            product.stock === 0
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'View Details'}
        </button>
      </div>
    </div>
  );
}

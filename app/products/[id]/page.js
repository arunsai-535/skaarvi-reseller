'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Shield, 
  TrendingUp,
  Share2,
  Heart,
  Loader2,
  ShoppingCart,
  Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductSaveButton from '@/components/product/ProductSaveButton';
import ProductShareButton from '@/components/product/ProductShareButton';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/products/${productId}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'success') {
          setProduct(result.data);
        } else {
          toast.error('Product not found');
          router.push('/products');
        }
      } else {
        // For demo, use mock data if API fails
        const mockProduct = {
          id: productId,
          name: 'Premium Wireless Headphones',
          description: 'Experience exceptional sound quality with our premium wireless headphones. Features active noise cancellation, 40-hour battery life, and premium comfort padding.',
          price: 2999,
          mrp: 4999,
          sellingPrice: 2999,
          resellerProfit: 500,
          stock: 25,
          imageUrl: 'https://via.placeholder.com/600',
          images: [
            'https://via.placeholder.com/600/0000FF/FFFFFF?text=Image+1',
            'https://via.placeholder.com/600/FF0000/FFFFFF?text=Image+2',
            'https://via.placeholder.com/600/00FF00/FFFFFF?text=Image+3',
          ],
          category: 'Electronics',
          brand: 'AudioTech',
          features: [
            'Active Noise Cancellation',
            '40-hour battery life',
            'Premium comfort padding',
            'Bluetooth 5.0',
            'Built-in microphone',
          ],
          specifications: {
            'Driver Size': '40mm',
            'Frequency Response': '20Hz - 20kHz',
            'Impedance': '32 Ohm',
            'Weight': '250g',
            'Warranty': '1 Year',
          },
        };
        setProduct(mockProduct);
      }
    } catch (error) {
      console.error('Fetch product error:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    // TODO: Implement direct checkout
    toast.info('Checkout functionality coming soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.imageUrl].filter(Boolean);
  const discount = product.mrp && product.mrp > (product.sellingPrice || product.price)
    ? Math.round(((product.mrp - (product.sellingPrice || product.price)) / product.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {images[selectedImage] && !imageError ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-300 dark:text-gray-600" />
                </div>
              )}
              
              {/* Stock Badge */}
              {product.stock <= 10 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded">
                  Only {product.stock} left
                </div>
              )}
              
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-600 dark:text-gray-400">
                  Brand: <span className="font-semibold">{product.brand}</span>
                </p>
              )}
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">(4.5)</span>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.sellingPrice || product.price)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Reseller Profit */}
              {product.resellerProfit && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                  <TrendingUp className="h-5 w-5" />
                  <span>Earn {formatPrice(product.resellerProfit)} per sale</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300 font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-white dark:bg-gray-800 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Save & Share */}
            <div className="flex gap-3">
              <div className="flex-1">
                <ProductSaveButton 
                  productId={product.id}
                  source="product_detail"
                />
              </div>
              <div className="flex-1">
                <ProductShareButton
                  productId={product.id}
                  productName={product.name}
                  productImage={product.imageUrl}
                  productUrl={`/products/${product.id}`}
                  source="product_detail"
                />
              </div>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Features
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Truck className="h-5 w-5" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Shield className="h-5 w-5" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Details */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Product Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {product.description}
            </p>
            
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Specifications
              </h2>
              <dl className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <dt className="font-medium text-gray-700 dark:text-gray-300">{key}</dt>
                    <dd className="text-gray-600 dark:text-gray-400">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

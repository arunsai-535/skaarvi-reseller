'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Mail, Bell, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call to save email
    setTimeout(() => {
      toast.success('Thank you! We\'ll notify you when customer portal launches.');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

      <div className="relative w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* Icon with Sparkle */}
            <div className="relative inline-flex">
              <div className="p-4 bg-gradient-to-br from-pink-600 to-pink-800 rounded-2xl">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
            </div>

            {/* Title */}
            <div>
              <div className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                Coming Soon
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Portal</h1>
              <p className="text-gray-600 mt-2">Browse products, place orders, and grow your business</p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-3 py-6 border-y border-gray-200">
            <h3 className="font-semibold text-gray-900 text-center mb-4">What's Coming</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600"></div>
                <span>Browse thousands of wholesale products</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600"></div>
                <span>Get best wholesale prices and margins</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600"></div>
                <span>Track orders and manage your business</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600"></div>
                <span>Fast delivery across India</span>
              </div>
            </div>
          </div>

          {/* Email Notification Form */}
          <form onSubmit={handleNotifyMe} className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-700 font-medium mb-4">
                Be the first to know when we launch!
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-800 text-white py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-pink-900 focus:ring-4 focus:ring-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Bell className="w-5 h-5" />
              {loading ? 'Subscribing...' : 'Notify Me at Launch'}
            </button>
          </form>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              We're working hard to bring you the best wholesale experience. Expected launch: Q3 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

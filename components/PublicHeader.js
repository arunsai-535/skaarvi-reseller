'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart,
  User,
  LogIn,
  Menu,
  X,
  Lock,
  Key,
  Shield,
  Building2,
  ShoppingBag,
  Store,
  Loader2
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import toast from 'react-hot-toast';

export default function PublicHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userType, setUserType] = useState('customer'); // customer, reseller, manufacturer, admin
  const [authMode, setAuthMode] = useState('password'); // password or otp
  const [loading, setLoading] = useState(false);

  // Auth form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const userTypeConfig = {
    customer: {
      icon: ShoppingBag,
      label: 'Customer',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Shop products and track orders',
      supportsOtp: true,
    },
    reseller: {
      icon: Store,
      label: 'Reseller',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      description: 'Sell products and earn commissions',
      supportsOtp: true,
      isResellerFlow: true,
    },
    manufacturer: {
      icon: Building2,
      label: 'Manufacturer',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Manage products and inventory',
      supportsOtp: true,
    },
    admin: {
      icon: Shield,
      label: 'Admin',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      description: 'Platform administration',
      supportsOtp: false,
    },
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = userType === 'reseller' ? 'customer' : userType;
      
      const response = await fetch('/api/auth/login/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          password,
          userType: endpoint,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user: userData, token, refreshToken } = data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        const { setCredentials } = await import('@/store/slices/authSlice');
        dispatch(setCredentials({ user: userData, token, refreshToken }));
        
        toast.success('Login successful!');
        setShowLoginModal(false);
        
        // Redirect based on role
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'manufacturer') {
          router.push('/manufacturer/products');
        } else if (userData.role === 'customer' && userType === 'reseller') {
          router.push('/register/reseller');
        } else if (userData.role === 'customer') {
          router.push('/customer');
        }
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = userType === 'reseller' ? 'customer' : userType;
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          userType: endpoint,
          purpose: 'login',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent successfully!');
        setOtpSent(true);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = userType === 'reseller' ? 'customer' : userType;
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          otp,
          userType: endpoint,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const { user: userData, token, refreshToken } = data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        const { setCredentials } = await import('@/store/slices/authSlice');
        dispatch(setCredentials({ user: userData, token, refreshToken }));
        
        toast.success('Login successful!');
        setShowLoginModal(false);
        
        // Redirect based on role
        if (userData.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (userData.role === 'manufacturer') {
          router.push('/manufacturer/products');
        } else if (userData.role === 'customer' && userType === 'reseller') {
          router.push('/register/reseller');
        } else if (userData.role === 'customer') {
          router.push('/customer');
        }
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resetModalState = () => {
    setIdentifier('');
    setPassword('');
    setMobile('');
    setOtp('');
    setOtpSent(false);
    setAuthMode('password');
    setLoading(false);
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    resetModalState();
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    resetModalState();
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Skaarvi</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Marketplace</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
              >
                Browse Products
              </Link>
              <Link
                href="/register/reseller"
                className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium transition-colors"
              >
                Become a Reseller
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Theme Switcher */}
              <ThemeSwitcher />

              {/* Login / User Menu */}
              {isAuthenticated && user ? (
                <Link
                  href={
                    user.role === 'admin'
                      ? '/admin/dashboard'
                      : user.role === 'manufacturer'
                      ? '/manufacturer/products'
                      : '/customer'
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Sign in to Skaarvi
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Choose your account type to continue
                </p>
              </div>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* User Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {Object.entries(userTypeConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isActive = userType === key;

                  return (
                    <button
                      key={key}
                      onClick={() => handleUserTypeChange(key)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isActive
                          ? `${config.bgColor} border-current ${config.color}`
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? config.color : ''}`} />
                      <p className="text-xs font-semibold text-center">{config.label}</p>
                    </button>
                  );
                })}
              </div>

              {/* Description */}
              <div className={`${userTypeConfig[userType].bgColor} rounded-lg p-4 mb-6`}>
                <p className={`text-sm font-medium ${userTypeConfig[userType].color} text-center`}>
                  {userTypeConfig[userType].description}
                </p>
              </div>

              {/* Auth Mode Tabs (if OTP is supported) */}
              {userTypeConfig[userType].supportsOtp && (
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <button
                    onClick={() => {
                      setAuthMode('password');
                      setOtpSent(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      authMode === 'password'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Lock className="w-4 h-4 inline-block mr-2" />
                    Password
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('otp');
                      setOtpSent(false);
                    }}
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                      authMode === 'otp'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Key className="w-4 h-4 inline-block mr-2" />
                    OTP
                  </button>
                </div>
              )}

              {/* Password Login Form */}
              {authMode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email or Mobile
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter email or mobile number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* OTP Login Form */}
              {authMode === 'otp' && userTypeConfig[userType].supportsOtp && (
                <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                      maxLength="10"
                      disabled={otpSent}
                      required
                    />
                  </div>
                  {otpSent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                        maxLength="6"
                        autoFocus
                        required
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {otpSent ? 'Verifying...' : 'Sending OTP...'}
                      </>
                    ) : (
                      <>
                        <Key className="h-5 w-5" />
                        {otpSent ? 'Verify OTP' : 'Send OTP'}
                      </>
                    )}
                  </button>
                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Change mobile number
                    </button>
                  )}
                </form>
              )}

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    href={
                      userType === 'customer' || userType === 'reseller'
                        ? '/register/customer'
                        : userType === 'manufacturer'
                        ? '/register/manufacturer'
                        : '#'
                    }
                    onClick={() => setShowLoginModal(false)}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

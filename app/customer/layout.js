'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  User,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Bell,
  Heart
} from 'lucide-react';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import NotificationBell from '@/components/NotificationBell';
import PageLoader from '@/components/PageLoader';

export default function CustomerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading) {
      if (!isAuthenticated) {
        toast.error('Please login to access customer dashboard');
        router.push(`/login/customer?redirect=${encodeURIComponent(pathname)}`);
      } else if (user?.role !== 'customer') {
        toast.error('Access denied: Customer account required');
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, user, loading, mounted, router, pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login/customer');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/customer',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'My Orders',
      href: '/customer/orders',
      icon: Package,
    },
    {
      name: 'Wishlist',
      href: '/customer/wishlist',
      icon: Heart,
    },
    {
      name: 'Profile',
      href: '/customer/profile',
      icon: User,
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  if (loading || !mounted) {
    return <PageLoader />;
  }

  if (!isAuthenticated || user?.role !== 'customer') {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Skaarvi</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Customer Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase() || user?.full_name?.[0]?.toUpperCase() || 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || user?.full_name || 'Customer'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Browse Products Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
              Browse Products
            </Link>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 lg:ml-0" />

            <div className="flex items-center gap-4">
              {/* Cart Badge */}
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

              {/* Notifications */}
              <NotificationBell />

              {/* Theme Switcher */}
              <ThemeSwitcher />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

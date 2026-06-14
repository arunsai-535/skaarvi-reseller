'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  Wallet,
  Loader2,
  LogOut,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import NotificationBell from '@/components/NotificationBell';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    pendingProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    totalEarnings: 0,
    pendingSettlements: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchLowStockProducts();
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookies
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/manufacturers/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch dashboard data');
      }

      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setStats({
          totalProducts: result.data.totalProducts || 0,
          activeProducts: result.data.activeProducts || 0,
          pendingProducts: result.data.pendingProducts || 0,
          totalOrders: result.data.totalOrders || 0,
          totalSales: result.data.totalSales || 0,
          totalEarnings: result.data.totalEarnings || 0,
          pendingSettlements: result.data.pendingSettlements || 0,
        });
        setRecentOrders(result.data.recentOrders || []);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch('/api/inventory?low_stock_only=true&limit=5');
      const data = await response.json();
      if (data.status === 'success') {
        setLowStockProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch low stock products:', error);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value.toFixed(0)}`;
  };

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'primary',
      subtitle: 'All products'
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      icon: CheckCircle,
      color: 'success',
      subtitle: 'Live on marketplace'
    },
    {
      title: 'Pending Products',
      value: stats.pendingProducts,
      icon: Clock,
      color: 'warning',
      subtitle: 'Awaiting approval'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'primary',
      subtitle: 'All time orders'
    },
    {
      title: 'Total Sales',
      value: formatCurrency(stats.totalSales),
      icon: DollarSign,
      color: 'success',
      subtitle: 'Total revenue'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(stats.totalEarnings),
      icon: TrendingUp,
      color: 'success',
      subtitle: 'After commission'
    },
    {
      title: 'Pending Settlements',
      value: formatCurrency(stats.pendingSettlements),
      icon: Wallet,
      color: 'warning',
      subtitle: 'To be settled'
    },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'delivered': 'badge-success',
      'shipped': 'badge-primary',
      'processing': 'badge-warning',
      'new': 'badge-info',
      'cancelled': 'badge-danger',
      'returned': 'badge-secondary',
    };
    return statusMap[status?.toLowerCase()] || 'badge-secondary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: 'rgb(var(--color-primary))' }} />
          <p style={{ color: 'rgb(var(--color-text-secondary))' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
      {/* Simple Header */}
      <header className="border-b sticky top-0 z-10 transition-colors" style={{ 
        backgroundColor: 'rgb(var(--color-background))',
        borderColor: 'rgb(var(--color-border))'
      }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: 'rgb(var(--color-text-secondary))' }}>Welcome back! Here's your overview</p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <NotificationBell />
              <button 
                onClick={() => router.push('/manufacturer/inventory')}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Inventory
              </button>
              <button 
                onClick={() => router.push('/manufacturer/earnings')}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Earnings
              </button>
              <button 
                onClick={() => router.push('/manufacturer/settlements')}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Settlements
              </button>
              <button 
                onClick={() => router.push('/manufacturer/reports')}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Reports
              </button>
              <button 
                onClick={() => router.push('/manufacturer/products/add')}
                className="btn btn-primary btn-sm"
              >
                Add Product
              </button>
              <button 
                onClick={handleLogout}
                className="btn btn-outline btn-sm flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid - 7 cards in responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.title}
                className="card hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="card border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Low Stock Alert
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lowStockProducts.length} product{lowStockProducts.length > 1 ? 's' : ''} running low
                  </p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/manufacturer/inventory?low_stock_only=true')}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push('/manufacturer/inventory')}
                >
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        SKU: {product.sku || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      {product.availableStock} / {product.low_stock_threshold}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Available / Threshold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-600">Latest orders from resellers</p>
            </div>
            <button 
              onClick={() => router.push('/manufacturer/orders')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-8">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, index) => (
                    <tr 
                      key={order.id || index}
                      onClick={() => router.push(`/manufacturer/orders/${order.id}`)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="font-medium text-primary-600">{order.id}</td>
                      <td>{order.product}</td>
                      <td>{order.quantity}</td>
                      <td>₹{order.amount?.toLocaleString()}</td>
                      <td className="text-sm text-gray-600">{formatDate(order.orderedAt)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

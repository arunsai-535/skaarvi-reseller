'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Eye,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Wallet
} from 'lucide-react';import ThemeSwitcher from '@/components/ThemeSwitcher';
export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 45,
    activeProducts: 38,
    pendingProducts: 7,
    totalOrders: 234,
    totalSales: 458900,
    totalEarnings: 234500,
    pendingSettlements: 45600,
  });

  const statsCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: '+12%',
      isPositive: true,
      icon: Package,
      color: 'primary',
      subtitle: 'All products'
    },
    {
      title: 'Active Products',
      value: stats.activeProducts,
      change: '+8%',
      isPositive: true,
      icon: CheckCircle,
      color: 'success',
      subtitle: 'Live on marketplace'
    },
    {
      title: 'Pending Products',
      value: stats.pendingProducts,
      change: '-3%',
      isPositive: false,
      icon: Clock,
      color: 'warning',
      subtitle: 'Awaiting approval'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      change: '+23%',
      isPositive: true,
      icon: ShoppingCart,
      color: 'primary',
      subtitle: 'All time orders'
    },
    {
      title: 'Total Sales',
      value: `₹${(stats.totalSales / 1000).toFixed(1)}K`,
      change: '+18%',
      isPositive: true,
      icon: DollarSign,
      color: 'success',
      subtitle: 'Total revenue'
    },
    {
      title: 'Total Earnings',
      value: `₹${(stats.totalEarnings / 1000).toFixed(1)}K`,
      change: '+15%',
      isPositive: true,
      icon: TrendingUp,
      color: 'success',
      subtitle: 'After commission'
    },
    {
      title: 'Pending Settlements',
      value: `₹${(stats.pendingSettlements / 1000).toFixed(1)}K`,
      change: '+5%',
      isPositive: true,
      icon: Wallet,
      color: 'warning',
      subtitle: 'To be settled'
    },
  ];

  const recentOrders = [
    { id: '#ORD001', product: 'Premium Laptop Stand', customer: 'Rahul Sharma', amount: 2499, status: 'Processing' },
    { id: '#ORD002', product: 'Wireless Mouse', customer: 'Priya Patel', amount: 899, status: 'Shipped' },
    { id: '#ORD003', product: 'USB-C Hub', customer: 'Amit Kumar', amount: 1599, status: 'Delivered' },
    { id: '#ORD004', product: 'Laptop Bag', customer: 'Sneha Reddy', amount: 1299, status: 'New' },
  ];

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
              <button className="btn btn-outline btn-sm">
                Download Report
              </button>
              <button className="btn btn-primary btn-sm">
                Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Stats Grid - 7 cards in responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
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
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                    stat.isPositive ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Product Views</p>
                <h3 className="text-2xl font-bold">12,453</h3>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success-500 to-success-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Resellers Interested</p>
                <h3 className="text-2xl font-bold">387</h3>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Conversion Rate</p>
                <h3 className="text-2xl font-bold">23.4%</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-600">Latest orders from resellers</p>
            </div>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium text-primary-600">{order.id}</td>
                    <td>{order.product}</td>
                    <td>{order.customer}</td>
                    <td>₹{order.amount.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'badge-success' :
                        order.status === 'Shipped' ? 'badge-primary' :
                        order.status === 'Processing' ? 'badge-warning' :
                        'badge-gray'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

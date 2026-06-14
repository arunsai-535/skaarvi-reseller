'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentManufacturers, setRecentManufacturers] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);



  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      // Fetch all manufacturers (pending endpoint may return all)
      const response = await fetch('/api/manufacturers/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch manufacturers');
      }

      const data = await response.json();
      const manufacturers = Array.isArray(data.data) ? data.data : [];

      // Calculate statistics
      const stats = {
        total: manufacturers.length,
        pending: manufacturers.filter(m => m.approvalStatus === 'pending').length,
        approved: manufacturers.filter(m => m.approvalStatus === 'approved').length,
        rejected: manufacturers.filter(m => m.approvalStatus === 'rejected').length,
      };

      // Get 5 most recent
      const recent = manufacturers
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats(stats);
      setRecentManufacturers(recent);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data: ' + error.message);
      // Set default values on error
      setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
      setRecentManufacturers([]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Manufacturers',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pending Approval',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: UserCheck,
      color: 'bg-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: UserX,
      color: 'bg-red-500',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of manufacturer registrations and approvals</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {stats.pending > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">
                {stats.pending} Pending Approval{stats.pending > 1 ? 's' : ''}
              </h3>
              <p className="text-yellow-700 text-sm mt-1">
                Review and approve manufacturer applications
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/manufacturers?filter=pending')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors"
            >
              View Pending
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Registrations</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentManufacturers.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No manufacturers registered yet
            </div>
          ) : (
            recentManufacturers.map((manufacturer) => (
              <div
                key={manufacturer.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => router.push(`/admin/manufacturers/${manufacturer.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {manufacturer.companyName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Brand: {manufacturer.brandName} • Contact: {manufacturer.contactPerson}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(manufacturer.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <StatusBadge status={manufacturer.approvalStatus} />
                </div>
              </div>
            ))
          )}
        </div>
        {recentManufacturers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => router.push('/admin/manufacturers')}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View All Manufacturers →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

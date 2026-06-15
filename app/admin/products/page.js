'use client';

import { useState, useEffect } from 'react';
import { Search, Edit, CheckCircle, XCircle, Eye, DollarSign } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    skaarviMargin: 0,
    resellerMargin: 0,
    platformFeeOverride: null
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, statusFilter, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/products?${params}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.status === 'success') {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPricing = (product) => {
    setSelectedProduct(product);
    setPricingForm({
      skaarviMargin: product.skaarviMargin || 0,
      resellerMargin: product.resellerMargin || 0,
      platformFeeOverride: product.platformFeeOverride || null
    });
    setShowPricingModal(true);
  };

  const handleSavePricing = async () => {
    if (!selectedProduct) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/products/${selectedProduct.id}/pricing`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(pricingForm)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setShowPricingModal(false);
        fetchProducts(); // Refresh list
        alert('Pricing updated successfully!');
      } else {
        alert(data.message || 'Failed to update pricing');
      }
    } catch (error) {
      console.error('Update pricing error:', error);
      alert('Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (productId) => {
    if (!confirm('Approve this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'PATCH',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.status === 'success') {
        fetchProducts();
        alert('Product approved!');
      } else {
        alert(data.message || 'Failed to approve product');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve product');
    }
  };

  const handleReject = async (productId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (data.status === 'success') {
        fetchProducts();
        alert('Product rejected');
      } else {
        alert(data.message || 'Failed to reject product');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject product');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending_approval: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      inactive: 'bg-gray-100 text-gray-600'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.draft}`}>
        {status?.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const calculateSellingPrice = (costPrice, skaarvi, reseller) => {
    const cost = parseFloat(costPrice) || 0;
    const s = parseFloat(skaarvi) / 100;
    const r = parseFloat(reseller) / 100;
    return cost * (1 + s + r);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>Product Management</h1>
        <p className="mt-2" style={{ color: 'rgb(var(--color-text-secondary))' }}>
          Manage product pricing margins and approvals across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'rgb(var(--color-text-secondary))' }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="input w-full pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
            className="input"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: 'rgb(var(--color-surface))', borderBottom: '1px solid rgb(var(--color-border))' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Manufacturer
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Cost Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Skaarvi %
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Reseller %
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Selling Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'rgb(var(--color-primary))' }}></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center" style={{ color: 'rgb(var(--color-text-secondary))' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="transition-colors" style={{ borderTop: '1px solid rgb(var(--color-border))' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-surface))'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.ProductImages?.[0] && (
                          <img
                            src={product.ProductImages[0].imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{product.name}</div>
                          <div className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>{product.sku || 'No SKU'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                      {product.Manufacturer?.businessName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium" style={{ color: 'rgb(var(--color-text))' }}>
                      {formatCurrency(product.costPrice)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                      {product.skaarviMargin}%
                    </td>
                    <td className="px-6 py-4 text-center text-sm" style={{ color: 'rgb(var(--color-text))' }}>
                      {product.resellerMargin}%
                    </td>
                    <td className="px-6 py-4 text-right font-semibold" style={{ color: 'rgb(var(--color-primary))' }}>
                      {formatCurrency(product.sellingPrice)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditPricing(product)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Pricing"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        {product.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleApprove(product.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {products.length} of {pagination.totalItems} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      {showPricingModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Product Pricing</h2>
              <p className="mt-1 text-sm text-gray-600">{selectedProduct.name}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price (Set by Manufacturer)
                </label>
                <input
                  type="text"
                  value={formatCurrency(selectedProduct.costPrice)}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skaarvi Margin (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={pricingForm.skaarviMargin}
                  onChange={(e) => setPricingForm(prev => ({ ...prev, skaarviMargin: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reseller Margin (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={pricingForm.resellerMargin}
                  onChange={(e) => setPricingForm(prev => ({ ...prev, resellerMargin: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Fee Override (%) - Optional
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="Leave blank for default"
                  value={pricingForm.platformFeeOverride || ''}
                  onChange={(e) => setPricingForm(prev => ({ ...prev, platformFeeOverride: e.target.value || null }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Calculated Selling Price:</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatCurrency(
                      calculateSellingPrice(
                        selectedProduct.costPrice,
                        pricingForm.skaarviMargin,
                        pricingForm.resellerMargin
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
              <button
                onClick={() => setShowPricingModal(false)}
                disabled={saving}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePricing}
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

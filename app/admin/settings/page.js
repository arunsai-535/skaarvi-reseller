'use client';

import { useState, useEffect } from 'react';
import { Save, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformFeePercentage: 5,
    defaultSkaarviMargin: 5,
    defaultResellerCommission: 10,
    lowStockThreshold: 10,
    settlementHoldDays: 7
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch current settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setSettings(data.data.settings);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to load settings' });
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
        setSettings(data.data.settings);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update settings' });
      }
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/admin/settings/reset', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: 'Settings reset to defaults!' });
        setSettings(data.data.settings);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to reset settings' });
      }
    } catch (error) {
      console.error('Reset settings error:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-2 text-gray-600">
          Configure global platform settings for pricing margins and operational parameters.
        </p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pricing Configuration</h2>
          <p className="mt-1 text-sm text-gray-600">
            These settings apply to all new products created by manufacturers.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Platform Fee Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Fee Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={settings.platformFeePercentage}
              onChange={(e) => handleChange('platformFeePercentage', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Fee charged on each order (deducted from manufacturer revenue).
            </p>
          </div>

          {/* Default Skaarvi Margin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Skaarvi Margin (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={settings.defaultSkaarviMargin}
              onChange={(e) => handleChange('defaultSkaarviMargin', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Default profit margin for Skaarvi on product pricing.
            </p>
          </div>

          {/* Default Reseller Commission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Reseller Commission (%)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              step="0.1"
              value={settings.defaultResellerCommission}
              onChange={(e) => handleChange('defaultResellerCommission', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Commission percentage for resellers selling products.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Low Stock Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              step="1"
              value={settings.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Default threshold to trigger low stock alerts for products.
            </p>
          </div>

          {/* Settlement Hold Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Settlement Hold Days
            </label>
            <input
              type="number"
              min="0"
              max="90"
              step="1"
              value={settings.settlementHoldDays}
              onChange={(e) => handleChange('settlementHoldDays', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Number of days to hold payments before processing settlements.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between rounded-b-lg">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Important Notes</h3>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Changes apply to all new products created after saving.</li>
              <li>• Existing products retain their current pricing margins.</li>
              <li>• You can override margins for individual products from the Products page.</li>
              <li>• Settings are applied immediately without server restart.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

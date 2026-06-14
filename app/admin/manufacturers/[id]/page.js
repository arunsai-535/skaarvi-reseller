'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import DocumentViewer from '@/components/admin/DocumentViewer';
import toast from 'react-hot-toast';

export default function ManufacturerDetailPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [manufacturer, setManufacturer] = useState(null);
  const [showDocument, setShowDocument] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchManufacturerDetails(params.id);
    }
  }, [params?.id]);

  const fetchManufacturerDetails = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all manufacturers and find the one we need
      const response = await fetch('/api/manufacturers/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch manufacturer details');
      }

      const data = await response.json();
      const foundManufacturer = (data.data || []).find(m => m.id === id);
      
      if (!foundManufacturer) {
        toast.error('Manufacturer not found');
        router.push('/admin/manufacturers');
        return;
      }

      setManufacturer(foundManufacturer);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load manufacturer details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `/api/manufacturers/${manufacturer.id}/approve`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve manufacturer');
      }

      toast.success('Manufacturer approved successfully!');
      router.push('/admin/manufacturers');
    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.message || 'Failed to approve manufacturer');
    } finally {
      setActionLoading(false);
      setShowApproveModal(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim() || rejectionReason.trim().length < 10) {
      toast.error('Please provide a reason (at least 10 characters)');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `/api/manufacturers/${manufacturer.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: rejectionReason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject manufacturer');
      }

      toast.success('Manufacturer rejected successfully!');
      router.push('/admin/manufacturers');
    } catch (error) {
      console.error('Reject error:', error);
      toast.error(error.message || 'Failed to reject manufacturer');
    } finally {
      setActionLoading(false);
      setShowRejectModal(false);
    }
  };

  const openDocument = (url, title, type = 'image') => {
    if (!url) {
      toast.error('Document not available');
      return;
    }
    setShowDocument({ url, title, type });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!manufacturer) {
    return null;
  }

  const documents = [
    {
      title: 'Company Logo',
      url: manufacturer.companyLogoUrl,
      icon: ImageIcon,
      type: 'image',
    },
    {
      title: 'PAN Card',
      url: manufacturer.panCardUrl,
      icon: FileText,
      type: 'image',
    },
    {
      title: 'Cancelled Cheque',
      url: manufacturer.cancelledChequeUrl,
      icon: FileText,
      type: 'image',
    },
    {
      title: 'GST Certificate',
      url: manufacturer.gstCertificateUrl,
      icon: FileText,
      type: 'pdf',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/manufacturers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{manufacturer.companyName}</h1>
            <p className="text-gray-600 mt-1">Review manufacturer application</p>
          </div>
        </div>
        <StatusBadge status={manufacturer.approvalStatus} />
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Company Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">Company Name</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.companyName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Brand Name</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.brandName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Contact Person</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.contactPerson}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Business Type</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.businessType || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">GST Number</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.gstNumber || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">PAN Number</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.panNumber}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-base text-gray-900 mt-1">
              {manufacturer.address}, {manufacturer.city}, {manufacturer.state} - {manufacturer.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Banking Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Banking Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">Account Holder Name</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.bankAccountHolder}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Account Number</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.bankAccountNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">IFSC Code</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.bankIfscCode}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Bank Name</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.bankName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">UPI ID</label>
            <p className="text-base text-gray-900 mt-1">{manufacturer.upiId || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Uploaded Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.title}
                onClick={() => doc.url && openDocument(doc.url, doc.title, doc.type)}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                  doc.url
                    ? 'border-primary-300 bg-primary-50 cursor-pointer hover:border-primary-400 hover:bg-primary-100'
                    : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <Icon className={`w-12 h-12 mx-auto mb-3 ${doc.url ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className={`font-medium ${doc.url ? 'text-gray-900' : 'text-gray-500'}`}>
                  {doc.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {doc.url ? 'Click to view' : 'Not provided'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {manufacturer.approvalStatus === 'pending' && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between gap-4 -mx-6 -mb-6">
          <button
            onClick={() => router.push('/admin/manufacturers')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Back to List
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Reject
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Approve
            </button>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocument && (
        <DocumentViewer document={showDocument} onClose={() => setShowDocument(null)} />
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Approve Manufacturer?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve <strong>{manufacturer.companyName}</strong>? They will be able to access the manufacturer dashboard and add products.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Manufacturer</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{manufacturer.companyName}</strong>:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 10 characters)..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              {rejectionReason.length}/10 characters minimum
            </p>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || rejectionReason.trim().length < 10}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

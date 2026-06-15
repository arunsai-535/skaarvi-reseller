'use client';

import { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Mail, 
  Link as LinkIcon,
  QrCode,
  X,
  Check
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductShareButton({ 
  productId, 
  productName,
  productImage,
  productUrl,
  source = 'product_page'
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ensure we have a full URL for sharing
  const getFullUrl = () => {
    if (typeof window === 'undefined') return productUrl;
    if (productUrl.startsWith('http')) return productUrl;
    return `${window.location.origin}${productUrl}`;
  };

  const trackShare = async (platform) => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('session_id') || generateSessionId();
      
      await fetch(`/api/analytics/products/${productId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          platform,
          source,
          sessionId,
          deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        }),
      });
    } catch (error) {
      console.error('Track share error:', error);
    }
  };

  const generateSessionId = () => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
    return sessionId;
  };

  const handleWhatsAppShare = () => {
    const fullUrl = getFullUrl();
    const text = `Check out ${productName}!\n${fullUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    trackShare('whatsapp');
    setShowMenu(false);
    toast.success('Opening WhatsApp...');
  };

  const handleEmailShare = () => {
    const fullUrl = getFullUrl();
    const subject = `Check out ${productName}`;
    const body = `I found this product and thought you might be interested:\n\n${productName}\n\n${fullUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    trackShare('email');
    setShowMenu(false);
    toast.success('Opening email client...');
  };

  const handleCopyLink = async () => {
    try {
      const fullUrl = getFullUrl();
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      trackShare('copy_link');
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleQRCode = () => {
    // Generate QR code - you can integrate a QR code library here
    trackShare('qr_code');
    toast.success('QR code feature coming soon!');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
        title="Share product"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Share Menu */}
          <div className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Share Product</h3>
              <button
                onClick={() => setShowMenu(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="p-2">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  WhatsApp
                </span>
              </button>

              {/* Email */}
              <button
                onClick={handleEmailShare}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-full">
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <LinkIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </button>

              {/* QR Code */}
              <button
                onClick={handleQRCode}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <QrCode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  QR Code
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

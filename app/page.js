'use client';

import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Building2, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  Lock, 
  Truck, 
  CheckCircle, 
  Headphones,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const userTypes = [
    {
      id: 'admin',
      title: 'Platform Administrator',
      description: 'Manage approvals, monitor platform activity, and oversee marketplace operations',
      icon: Shield,
      color: 'from-indigo-600 to-indigo-800',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      path: '/login/admin',
      badge: 'Admin Portal'
    },
    {
      id: 'manufacturer',
      title: "I'm a Manufacturer",
      description: 'List products, manage inventory, track orders, and grow your business',
      icon: Building2,
      color: 'from-purple-600 to-purple-800',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/login/manufacturer',
      badge: 'Sell Products'
    },
    {
      id: 'customer',
      title: "I'm a Reseller",
      description: 'Browse products, place orders, manage your business, and maximize profits',
      icon: ShoppingBag,
      color: 'from-pink-600 to-pink-800',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      path: '/login/customer',
      badge: 'Buy Wholesale'
    }
  ];

  const features = [
    {
      icon: Package,
      title: 'Wide Product Range',
      description: 'Access thousands of products across multiple categories from verified manufacturers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: DollarSign,
      title: 'Competitive Pricing',
      description: 'Best wholesale prices and attractive margins for resellers to maximize profits',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'Multiple payment options with secure transactions and buyer protection',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick shipping across India with reliable logistics partners and tracking',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'All manufacturers verified for authenticity, quality standards, and reliability',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer support team ready to assist with any queries or issues',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8 animate-fadeIn">
            {/* Logo/Brand */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <Sparkles className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">SKAARVI</h1>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto">
              India's Premier B2B Reseller Marketplace
            </h2>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto font-light">
              Connecting manufacturers with resellers across India. Wide product range, competitive pricing, and seamless ordering.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">1000+</div>
                <div className="text-sm text-white/80">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">50+</div>
                <div className="text-sm text-white/80">Verified Manufacturers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold">All India</div>
                <div className="text-sm text-white/80">Delivery Network</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* User Type Selection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select how you'd like to use SKAARVI marketplace
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  role="button"
                  tabIndex={0}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
                  onClick={() => router.push(type.path)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(type.path);
                    }
                  }}
                  style={{ animationDelay: `${index * 100}ms` }}
                  aria-label={`Login as ${type.title}`}
                >
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 ${type.bgColor} ${type.textColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                    {type.badge}
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${type.color} mb-6`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {type.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {type.description}
                    </p>

                    {/* CTA Button */}
                    <button className={`inline-flex items-center gap-2 ${type.textColor} font-semibold group-hover:gap-4 transition-all`}>
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Hover Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose SKAARVI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for successful B2B wholesale trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-bold">SKAARVI</h3>
              </div>
              <p className="text-sm text-gray-400">
                India's trusted B2B reseller marketplace connecting manufacturers with resellers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">How It Works</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Pricing</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Refund Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Shipping Policy</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-sm">
                <li>Email: support@skaarvi.com</li>
                <li>Phone: +91 1800-XXX-XXXX</li>
                <li>Address: India</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 SKAARVI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after a brief moment to show message
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to SKAARVI</h1>
          <p className="text-gray-600">
            Please select your user type from the home page to continue.
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
        >
          Go to Home
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-sm text-gray-500">
          Redirecting automatically in 3 seconds...
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { setCredentials } from '@/store/slices/authSlice';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const formattedMobile = `+91${mobile}`;
      const response = await authAPI.sendOtp(formattedMobile);
      
      toast.success('OTP sent successfully!');
      
      // Show OTP in development mode
      if (response.otp) {
        toast.success(`Development OTP: ${response.otp}`, { duration: 10000 });
      }
      
      setStep('otp');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const formattedMobile = `+91${mobile}`;
      const response = await authAPI.verifyOtp(formattedMobile, otp);
      
      const { user, token, refreshToken, isNewUser } = response.data;

      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      // Update Redux store
      dispatch(setCredentials({ user, token, refreshToken }));

      if (isNewUser) {
        toast.success('Welcome! Please complete your profile.');
        router.push('/register');
      } else if (!user.manufacturer) {
        toast.success('Welcome! Please complete your manufacturer registration.');
        router.push('/register');
      } else if (user.manufacturer.status === 'pending') {
        toast.info('Your account is pending approval.');
        router.push('/pending-approval');
      } else if (user.manufacturer.status === 'approved') {
        toast.success('Login successful!');
        router.push('/manufacturer/dashboard');
      } else {
        toast.error('Your account status: ' + user.manufacturer.status);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manufacturer Login
          </h1>
          <p className="text-gray-600">
            {step === 'mobile' 
              ? 'Enter your mobile number to receive OTP' 
              : 'Enter the OTP sent to your mobile'
            }
          </p>
        </div>

        {/* Login Card */}
        <div className="card">
          {step === 'mobile' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label htmlFor="mobile" className="label">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="input pl-14"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || mobile.length !== 10}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="label">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="input text-center text-2xl tracking-widest"
                  disabled={loading}
                  required
                  autoFocus
                />
                <div className="mt-2 text-sm text-gray-600 text-center">
                  OTP sent to +91 {mobile}
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('mobile');
                    setOtp('');
                    setError('');
                  }}
                  className="btn btn-secondary flex-1"
                  disabled={loading}
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Login
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
                disabled={loading}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Register as Manufacturer
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Building2, ArrowRight, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state) => state.auth.user);
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Business Details, 3: Bank Details, 4: Documents (OTP bypassed)
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    // Pre-fill if user exists
    mobile: user?.mobile?.replace('+91', '') || '',
    email: user?.email || searchParams.get('email') || '',
    // Step 1: Basic Information
    companyName: '',
    brandName: '',
    contactPersonName: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Step 2: Business Details
    businessType: '',
    // Step 3: Bank Details
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    // Step 4: Documents
    gstCertificate: null,
    panCard: null,
    cancelledCheque: null,
    companyLogo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // OTP verification bypassed - users start directly at registration
  useEffect(() => {
    // Automatically start at step 1
    setStep(1);
  }, []);

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await authAPI.sendRegistrationOtp(formData.email);
      setOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp(formData.email, otp);
      
      // Store tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      toast.success('Email verified! Now complete your registration');
      setStep(1); // Move to basic info step
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('=== Starting Registration Submission ===');

    // Validate required files
    if (!formData.panCard) {
      toast.error('Please upload PAN Card');
      setLoading(false);
      return;
    }
    if (!formData.cancelledCheque) {
      toast.error('Please upload Cancelled Cheque or Bank Proof');
      setLoading(false);
      return;
    }
    if (!formData.companyLogo) {
      toast.error('Please upload Company Logo');
      setLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && typeof formData[key] !== 'object') {
          submitData.append(key, formData[key]);
          console.log(`Added field: ${key} = ${formData[key]}`);
        }
      });

      // Format mobile with country code
      submitData.set('mobile', `+91${formData.mobile}`);
      console.log('Mobile formatted:', `+91${formData.mobile}`);

      // Append files
      if (formData.gstCertificate) {
        submitData.append('gstCertificate', formData.gstCertificate);
        console.log('Added gstCertificate:', formData.gstCertificate.name);
      }
      if (formData.panCard) {
        submitData.append('panCard', formData.panCard);
        console.log('Added panCard:', formData.panCard.name);
      }
      if (formData.cancelledCheque) {
        submitData.append('cancelledCheque', formData.cancelledCheque);
        console.log('Added cancelledCheque:', formData.cancelledCheque.name);
      }
      if (formData.companyLogo) {
        submitData.append('companyLogo', formData.companyLogo);
        console.log('Added companyLogo:', formData.companyLogo.name);
      }

      console.log('Calling authAPI.register...');
      const response = await authAPI.register(submitData);
      console.log('Registration response:', response);
      
      toast.success(response.message || 'Registration submitted successfully!');
      
      // Clear localStorage and redirect to login page
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login page
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('=== Registration Error ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      console.log('=== Registration Submission Complete ===');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manufacturer Registration
          </h1>
          <p className="text-gray-600">
            Join Skaarvi marketplace and grow your business
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > s ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Basic Info</span>
            <span>Business</span>
            <span>Bank Details</span>
            <span>Documents</span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="card">
          <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="companyName" className="label">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="brandName" className="label">
                      Brand Name *
                    </label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPersonName" className="label">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      id="contactPersonName"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className="label">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="gstNumber" className="label">
                      GST Number <span className="text-gray-500 text-sm">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="22AAAAA0000A1Z5"
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="panNumber" className="label">
                      PAN Number <span className="text-gray-500 text-sm">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="label">
                      Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="label">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="label">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="pincode" className="label">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="input"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="businessType" className="label">
                      Business Type *
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="proprietorship">Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="llp">LLP</option>
                      <option value="pvt_ltd">Private Limited</option>
                      <option value="public_ltd">Public Limited</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 text-sm text-gray-600">
                    <p>Please ensure all the information provided in the previous step is accurate. You can go back to make changes if needed.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Details</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Provide your bank account details for payment settlements
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="accountHolderName" className="label">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      id="accountHolderName"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      placeholder="Enter account holder name"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="accountNumber" className="label">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ifscCode" className="label">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="e.g., SBIN0001234"
                      className="input"
                      maxLength="11"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="bankName" className="label">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="e.g., State Bank of India"
                      className="input"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="upiId" className="label">
                      UPI ID <span className="text-gray-500 text-sm">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="yourname@upi"
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> This bank account will be used for receiving payments from completed orders. Please ensure the details are accurate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload clear copies of the required documents
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      GST Certificate <span className="text-gray-500 text-sm">(Optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'gstCertificate')}
                        className="hidden"
                        id="gstCertificate"
                      />
                      <label htmlFor="gstCertificate" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.gstCertificate 
                            ? formData.gstCertificate.name 
                            : 'Click to upload GST Certificate'
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      PAN Card *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer ${
                      formData.panCard ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'panCard')}
                        className="hidden"
                        id="panCard"
                      />
                      <label htmlFor="panCard" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.panCard 
                            ? `✓ ${formData.panCard.name}` 
                            : 'Click to upload PAN Card'
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      Cancelled Cheque / Bank Proof *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer ${
                      formData.cancelledCheque ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'cancelledCheque')}
                        className="hidden"
                        id="cancelledCheque"
                      />
                      <label htmlFor="cancelledCheque" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.cancelledCheque 
                            ? `✓ ${formData.cancelledCheque.name}` 
                            : 'Click to upload Cancelled Cheque or Bank Statement'
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG or PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      Company Logo *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer ${
                      formData.companyLogo ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'companyLogo')}
                        className="hidden"
                        id="companyLogo"
                      />
                      <label htmlFor="companyLogo" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.companyLogo 
                            ? `✓ ${formData.companyLogo.name}` 
                            : 'Click to upload Company Logo'
                          }
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG or PNG (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> All uploaded documents will be verified by our team. Please ensure they are clear and readable.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-secondary flex-1"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {step === 0 ? (otpSent ? 'Verifying...' : 'Sending OTP...') : 
                     step === 4 ? 'Submitting...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {step === 0 ? (otpSent ? 'Verify OTP' : 'Send OTP') :
                     step === 4 ? 'Submit Registration' : 'Next'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Login here
          </a>
        </div>
      </div>
    </div>
  );
}
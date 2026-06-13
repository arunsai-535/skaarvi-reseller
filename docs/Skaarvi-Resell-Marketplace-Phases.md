# SKAARVI RESELL MARKETPLACE - PHASE-WISE IMPLEMENTATION PLAN

## Project Timeline: 12-16 Weeks

---

## 📋 PHASE 1: FOUNDATION & SETUP (Week 1-2)

### Week 1: Project Setup & Infrastructure

#### 1.1 Development Environment Setup
- [ ] Install Node.js (v18+), PostgreSQL, Git
- [ ] Set up code editor (VS Code) with extensions
- [ ] Create GitHub repository
- [ ] Set up project management tool (Jira/Trello)
- [ ] Create development, staging, and production branches

#### 1.2 Backend Setup
```bash
# Initialize Node.js project
npm init -y
npm install express pg sequelize bcrypt jsonwebtoken dotenv cors
npm install nodemon --save-dev
```

**Files to Create:**
- `server.js` - Main server file
- `config/database.js` - Database configuration
- `config/constants.js` - App constants
- `.env` - Environment variables
- `.gitignore` - Git ignore file

#### 1.3 Frontend Setup
```bash
# Create Next.js project
npx create-next-app@latest skaarvi-resell-frontend
cd skaarvi-resell-frontend

# Install dependencies
npm install axios tailwindcss @headlessui/react react-hot-toast

# Install Redux and JWT dependencies
npm install @reduxjs/toolkit react-redux redux-persist jwt-decode
npm install @types/node @types/react --save-dev
```

**Files to Create:**
- `store/store.js` - Redux store configuration
- `store/slices/authSlice.js` - Authentication state management
- `store/slices/userSlice.js` - User profile state
- `utils/axios.js` - Axios instance with interceptors
- `utils/auth.js` - JWT token management utilities
- `hooks/useAuth.js` - Custom authentication hook
- `middleware/authMiddleware.js` - Protected route middleware

**Configure:**
- Tailwind CSS
- API base URL
- Environment variables
- Redux Provider wrapper
- Redux Persist for auth state

#### 1.4 Database Setup
- [ ] Install PostgreSQL
- [ ] Create database: `skaarvi_resell_db`
- [ ] Set up database connection
- [ ] Create initial migration files

#### 1.5 AWS Setup
- [ ] Create AWS account
- [ ] Set up S3 bucket for media storage
- [ ] Configure IAM user with S3 permissions
- [ ] Get AWS access keys
- [ ] Test file upload to S3

#### 1.6 Third-Party Services
- [ ] Razorpay account setup
- [ ] Get API keys (test mode)
- [ ] WhatsApp Business API setup
- [ ] SendGrid/AWS SES for email
- [ ] SMS gateway setup (MSG91/Twilio)

**Deliverables:**
- ✅ Working development environment
- ✅ Connected database
- ✅ Basic server running
- ✅ Frontend scaffolded
- ✅ AWS S3 configured

---

### Week 2: Database Schema & Core Models

#### 2.1 Create Database Tables
Execute SQL scripts in order:

**Priority 1 - User Management:**
```sql
-- users table
-- manufacturers table
-- resellers table
-- customers table
```

**Priority 2 - Product Management:**
```sql
-- categories table
-- products table
-- product_images table
-- product_videos table
-- product_pricing table
```

**Priority 3 - Order Management:**
```sql
-- orders table
-- order_items table
-- order_status_history table
```

**Priority 4 - Financial:**
```sql
-- wallets table
-- wallet_transactions table
-- withdrawal_requests table
-- commission_logs table
```

**Priority 5 - Tracking:**
```sql
-- referral_clicks table
-- product_views table
-- analytics_events table
```

#### 2.2 Create Sequelize Models
- [ ] `models/User.js`
- [ ] `models/Manufacturer.js`
- [ ] `models/Reseller.js`
- [ ] `models/Product.js`
- [ ] `models/Order.js`
- [ ] `models/Wallet.js`
- [ ] `models/ReferralClick.js`

#### 2.3 Define Model Relationships
```javascript
// Example relationships
User.hasOne(Manufacturer);
User.hasOne(Reseller);
Manufacturer.hasMany(Product);
Product.belongsTo(Manufacturer);
Reseller.hasMany(Order);
Order.belongsTo(Reseller);
```

#### 2.4 Create Seeders
- [ ] Admin user seeder
- [ ] Categories seeder
- [ ] Sample manufacturer seeder
- [ ] Sample reseller seeder

**Deliverables:**
- ✅ Complete database schema
- ✅ All models created
- ✅ Relationships defined
- ✅ Test data seeded

---

## 🔐 PHASE 2: AUTHENTICATION & USER MANAGEMENT (Week 3-4)

### 📌 Redux + JWT Authentication Overview

**Technology Stack:**
- **State Management:** Redux Toolkit + Redux Persist
- **Authentication:** JWT (Access + Refresh Tokens)
- **API Client:** Axios with interceptors
- **Token Storage:** localStorage + Redux Persist (encrypted)
- **Security:** Rate limiting, token rotation, blacklisting

**Key Files Structure:**
```
Frontend:
├── store/
│   ├── store.js                    # Redux store configuration
│   └── slices/
│       ├── authSlice.js            # Authentication state
│       ├── userSlice.js            # User profile state
│       ├── productSlice.js         # Products state
│       ├── cartSlice.js            # Shopping cart state
│       ├── orderSlice.js           # Orders state
│       └── walletSlice.js          # Wallet state
├── utils/
│   ├── axios.js                    # Axios instance + interceptors
│   └── auth.js                     # JWT token utilities
├── services/
│   └── authService.js              # Authentication API calls
├── hooks/
│   ├── useAuth.js                  # Auth state hook
│   ├── useProducts.js              # Products hook
│   └── useCart.js                  # Cart hook
└── components/auth/
    ├── ProtectedRoute.jsx          # Route protection
    └── [auth components]

Backend:
├── utils/
│   └── jwtHelper.js                # JWT generation & verification
├── middleware/
│   └── authMiddleware.js           # Token validation
├── controllers/
│   └── authController.js           # Auth endpoints
├── models/
│   └── RefreshToken.js             # Refresh token storage
└── routes/
    └── auth.js                     # Auth routes
```

**Authentication Flow:**
1. User enters mobile → OTP sent
2. User verifies OTP → Receives access + refresh tokens
3. Access token stored in Redux + localStorage (1hr expiry)
4. Refresh token stored in Redux + Database (7 days expiry)
5. Axios interceptors auto-refresh expired tokens
6. Protected routes check auth state via Redux
7. Logout revokes tokens + clears state

**Quick Start - Installation Commands:**
```bash
# Backend
npm install express jsonwebtoken bcrypt
npm install redis express-rate-limit helmet
npm install express-validator

# Frontend
npm install @reduxjs/toolkit react-redux redux-persist
npm install jwt-decode axios react-hot-toast
npm install redux-persist-transform-encrypt

# Optional DevTools
npm install --save-dev @redux-devtools/extension
```

---

### Week 3: Authentication System

#### 3.1 OTP-Based Authentication
**Backend:**
- [ ] `routes/auth.js`
- [ ] `controllers/authController.js`
- [ ] `services/otpService.js`
- [ ] `middleware/authMiddleware.js`
- [ ] `utils/jwtHelper.js`

**Endpoints:**
```javascript
POST /api/auth/send-otp        // Send OTP to mobile
POST /api/auth/verify-otp      // Verify OTP and login
POST /api/auth/refresh-token   // Refresh JWT token
POST /api/auth/logout          // Logout
GET  /api/auth/verify          // Verify token validity
GET  /api/auth/me              // Get current user
```

**OTP Flow:**
1. User enters mobile number
2. Generate 6-digit OTP
3. Store OTP in cache (Redis) with 5-min expiry
4. Send OTP via SMS
5. User enters OTP
6. Verify OTP
7. Generate JWT token (access + refresh)
8. Return tokens + user data
9. Store refresh token in database

#### 3.2 JWT Token Management (Backend)
```javascript
// utils/jwtHelper.js
const jwt = require('jsonwebtoken');

// Generate tokens
function generateTokens(user) {
  const payload = {
    id: user.id,
    mobile: user.mobile,
    role: user.role,
    email: user.email
  };
  
  const accessToken = jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    payload, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Verify token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Middleware for protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
    next();
  };
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  authenticateToken,
  authorizeRoles
};
```

#### 3.3 Redux Store Setup (Frontend)
**Create Redux Store with Auth Slice:**

**File: `store/store.js`**
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Persist config for auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'refreshToken', 'isAuthenticated', 'user']
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
```

**File: `store/slices/authSlice.js`**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '@/services/authService';
import { setAuthToken, removeAuthToken } from '@/utils/auth';

// Async thunks
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (mobile, { rejectWithValue }) => {
    try {
      const response = await authService.sendOTP(mobile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(mobile, otp);
      const { accessToken, refreshToken, user } = response.data;
      
      // Store token in axios headers
      setAuthToken(accessToken);
      
      return { accessToken, refreshToken, user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      const response = await authService.refreshToken(refreshToken);
      const { accessToken } = response.data;
      
      setAuthToken(accessToken);
      return { accessToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.otpSent = false;
      removeAuthToken();
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.otpLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.otpSent = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refresh Token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        removeAuthToken();
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
```

#### 3.4 Authentication Utilities (Frontend)

**File: `utils/auth.js`**
```javascript
import jwtDecode from 'jwt-decode';
import axios from './axios';

// Store token in axios default headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('accessToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken');
  }
};

// Remove token
export const removeAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get token from localStorage
export const getStoredToken = () => {
  return localStorage.getItem('accessToken');
};

// Decode token
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};
```

**File: `utils/axios.js`**
```javascript
import axios from 'axios';
import { store } from '@/store/store';
import { refreshAccessToken, logout } from '@/store/slices/authSlice';
import { getStoredToken, isTokenExpired, setAuthToken } from './auth';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getStoredToken();
    
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && isTokenExpired(token)) {
      // Try to refresh token
      try {
        await store.dispatch(refreshAccessToken()).unwrap();
        const newToken = store.getState().auth.token;
        config.headers.Authorization = `Bearer ${newToken}`;
      } catch (error) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await store.dispatch(refreshAccessToken()).unwrap();
        const newToken = store.getState().auth.token;
        
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

#### 3.5 Authentication Services (Frontend)

**File: `services/authService.js`**
```javascript
import axios from '@/utils/axios';

export const sendOTP = async (mobile) => {
  return await axios.post('/auth/send-otp', { mobile });
};

export const verifyOTP = async (mobile, otp) => {
  return await axios.post('/auth/verify-otp', { mobile, otp });
};

export const refreshToken = async (refreshToken) => {
  return await axios.post('/auth/refresh-token', { refreshToken });
};

export const getCurrentUser = async () => {
  return await axios.get('/auth/me');
};

export const logoutUser = async () => {
  return await axios.post('/auth/logout');
};
```

#### 3.6 Custom Hooks

**File: `hooks/useAuth.js`**
```javascript
import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isManufacturer: user?.role === 'manufacturer',
    isReseller: user?.role === 'reseller',
    isCustomer: user?.role === 'customer',
    isAdmin: user?.role === 'admin',
  };
};
```

#### 3.7 Frontend - Login Pages with Redux
**File: `/pages/_app.js`**
```javascript
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
```

**File: `/pages/login.js`**
```javascript
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { sendOTP, verifyOTP, clearError } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, otpSent, otpLoading, isLoading, error } = useSelector(
    (state) => state.auth
  );
  
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!mobile || mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    try {
      await dispatch(sendOTP(mobile)).unwrap();
      setShowOtpInput(true);
      toast.success('OTP sent successfully!');
    } catch (err) {
      // Error handled by Redux
    }
  };
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      await dispatch(verifyOTP({ mobile, otp })).unwrap();
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (err) {
      // Error handled by Redux
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to Skaarvi
        </h1>
        
        {!showOtpInput ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10-digit mobile"
                maxLength="10"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={otpLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {otpLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-2"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowOtpInput(false)}
              className="w-full text-blue-600 py-2"
            >
              Change Mobile Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

**Components to Create:**
- [ ] `components/auth/OTPInput.jsx` - Styled OTP input component
- [ ] `components/auth/MobileInput.jsx` - Mobile number input with validation
- [ ] `components/auth/ResendOTP.jsx` - Resend OTP with countdown timer
- [ ] `components/layout/AuthLayout.jsx` - Layout for auth pages

**Features:**
- Mobile number input with validation
- OTP input (6 digits)
- Resend OTP (after 30 seconds)
- Loading states managed by Redux
- Error handling with toast notifications
- Auto-redirect on successful login
- Persistent auth state across page refreshes

#### 3.8 Protected Routes & Authorization

**File: `components/auth/ProtectedRoute.jsx`**
```javascript
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [] 
}) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, user, isLoading, allowedRoles, router]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return null;
  }
  
  return children;
}
```

**Usage Example:**
```javascript
// pages/manufacturer/dashboard.js
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ManufacturerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['manufacturer']}>
      <div>Manufacturer Dashboard Content</div>
    </ProtectedRoute>
  );
}

// pages/admin/users.js
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminUsers() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>Admin Users Management</div>
    </ProtectedRoute>
  );
}
```

**Higher-Order Component for Route Protection:**
```javascript
// hoc/withAuth.js
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAuth = (Component, allowedRoles = []) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
          router.push('/unauthorized');
        }
      }
    }, [isAuthenticated, user, isLoading]);
    
    if (isLoading || !isAuthenticated) {
      return <div>Loading...</div>;
    }
    
    return <Component {...props} />;
  };
};

// Usage:
// export default withAuth(ManufacturerDashboard, ['manufacturer']);
```

**Deliverables:**
- ✅ OTP-based login working with Redux state management
- ✅ JWT authentication implemented (access + refresh tokens)
- ✅ Protected routes configured with role-based access
- ✅ Session management with Redux Persist
- ✅ Token refresh mechanism with Axios interceptors
- ✅ Auth state persists across page refreshes
- ✅ Automatic token expiry handling

#### 3.9 Environment Configuration

**Backend `.env`:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skaarvi_resell_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-key-change-this
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# OTP
OTP_EXPIRY=300
# 5 minutes in seconds

# SMS Gateway (MSG91/Twilio)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=SKAARV

# Redis (for OTP storage)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=skaarvi-marketplace

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Skaarvi Marketplace
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 3.10 Additional Redux Features

**File: `store/slices/userSlice.js`**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
```

**Testing Checklist:**
- [ ] Send OTP successfully
- [ ] Verify OTP and receive tokens
- [ ] Access token stored in Redux and localStorage
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based access control works
- [ ] Token refresh on expiry
- [ ] Logout clears all auth state
- [ ] Auth state persists on page refresh
- [ ] 401 responses trigger token refresh
- [ ] Multiple tabs sync auth state

#### 3.11 Security Best Practices for JWT

**Backend Security Measures:**

**1. Token Storage in Database:**
```javascript
// models/RefreshToken.js
const refreshTokenSchema = {
  id: DataTypes.UUID,
  userId: DataTypes.UUID,
  token: DataTypes.TEXT,
  expiresAt: DataTypes.DATE,
  isRevoked: DataTypes.BOOLEAN,
  deviceInfo: DataTypes.TEXT,
  ipAddress: DataTypes.STRING,
  createdAt: DataTypes.DATE
};

// Store refresh token on login
async function storeRefreshToken(userId, token, deviceInfo, ipAddress) {
  await RefreshToken.create({
    userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    deviceInfo,
    ipAddress
  });
}

// Validate refresh token
async function validateRefreshToken(token) {
  const storedToken = await RefreshToken.findOne({
    where: { token, isRevoked: false },
    include: [{ model: User }]
  });
  
  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }
  
  return storedToken;
}
```

**2. Token Rotation on Refresh:**
```javascript
// controllers/authController.js
async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;
    
    // Verify old refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await validateRefreshToken(refreshToken);
    
    // Revoke old refresh token
    await RefreshToken.update(
      { isRevoked: true },
      { where: { token: refreshToken } }
    );
    
    // Generate new tokens
    const newTokens = generateTokens(storedToken.User);
    
    // Store new refresh token
    await storeRefreshToken(
      storedToken.userId,
      newTokens.refreshToken,
      req.headers['user-agent'],
      req.ip
    );
    
    res.json({
      success: true,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}
```

**3. Token Blacklisting for Logout:**
```javascript
// Use Redis for blacklist
const redis = require('redis');
const redisClient = redis.createClient();

// Logout endpoint
async function logout(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.decode(token);
  
  // Add token to blacklist with expiry
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);
  await redisClient.setEx(`blacklist:${token}`, ttl, 'true');
  
  // Revoke refresh token
  await RefreshToken.update(
    { isRevoked: true },
    { where: { userId: req.user.id, isRevoked: false } }
  );
  
  res.json({ success: true, message: 'Logged out successfully' });
}

// Check blacklist in middleware
function checkBlacklist(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  redisClient.get(`blacklist:${token}`, (err, result) => {
    if (result) {
      return res.status(401).json({ error: 'Token has been revoked' });
    }
    next();
  });
}
```

**4. Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

// Limit OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: 'Too many OTP requests, please try again later'
});

// Limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later'
});

router.post('/send-otp', otpLimiter, sendOTP);
router.post('/verify-otp', loginLimiter, verifyOTP);
```

**5. XSS and CSRF Protection:**
```javascript
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Sanitize user input
const { body, validationResult } = require('express-validator');

router.post('/verify-otp', [
  body('mobile').trim().escape().isLength({ min: 10, max: 10 }),
  body('otp').trim().escape().isLength({ min: 6, max: 6 })
], verifyOTP);
```

**Frontend Security Measures:**

**1. Secure Token Storage:**
```javascript
// Avoid storing sensitive data in localStorage for high-security apps
// Consider using httpOnly cookies for refresh tokens

// Option 1: Store in memory (more secure, lost on refresh)
let accessTokenInMemory = null;

export const setAccessTokenInMemory = (token) => {
  accessTokenInMemory = token;
};

export const getAccessTokenFromMemory = () => {
  return accessTokenInMemory;
};

// Option 2: Use httpOnly cookies for refresh token (backend sets)
// Backend: res.cookie('refreshToken', token, { httpOnly: true, secure: true });
```

**2. Content Security Policy:**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

**3. Secure Redux Persist:**
```javascript
import { encryptTransform } from 'redux-persist-transform-encrypt';

const encryptor = encryptTransform({
  secretKey: process.env.NEXT_PUBLIC_PERSIST_SECRET,
  onError: function (error) {
    console.error('Encryption error:', error);
  },
});

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'refreshToken', 'isAuthenticated', 'user'],
  transforms: [encryptor] // Encrypt sensitive data
};
```

**Security Checklist:**
- [ ] JWT secrets are strong and environment-specific
- [ ] Refresh tokens stored in database with expiry
- [ ] Token rotation implemented on refresh
- [ ] Blacklist/revocation system for logout
- [ ] Rate limiting on auth endpoints
- [ ] XSS protection with helmet
- [ ] CSRF protection enabled
- [ ] Input validation and sanitization
- [ ] HTTPS enforced in production
- [ ] Secure cookie flags (httpOnly, secure, sameSite)
- [ ] Token expiry times are reasonable
- [ ] Redux persist data is encrypted
- [ ] No sensitive data in Redux DevTools in production

---

### Week 4: User Registration & Profiles

#### 4.1 User Registration Forms
**Create registration pages for each user type:**

**Manufacturer Registration:**
- [ ] `/pages/register/manufacturer.js`
- Company details form
- GST number validation
- Bank details
- Document upload

**Reseller Registration:**
- [ ] `/pages/register/reseller.js`
- Personal details form
- Address information
- Bank/UPI details
- Generate unique reseller code (SKR1001, SKR1002...)

**Customer Registration:**
- Minimal registration (happens during checkout)
- Just name, mobile, email

#### 4.2 Profile Management
**Backend:**
```javascript
GET    /api/profile              // Get user profile
PUT    /api/profile              // Update profile
POST   /api/profile/upload       // Upload profile image
```

**Frontend:**
- [ ] `pages/profile/edit.js`
- [ ] Profile view page
- [ ] Profile edit form
- [ ] Image upload component

#### 4.3 Admin - User Management
- [ ] `pages/admin/manufacturers.js` - List & verify
- [ ] `pages/admin/resellers.js` - List & manage
- [ ] Approve/reject users
- [ ] Change user status
- [ ] View user details

**Deliverables:**
- ✅ Registration flows for all user types
- ✅ Profile management working
- ✅ Admin can manage users
- ✅ Document upload functional

#### 4.4 Additional Redux Slices for Marketplace Features

**Expand Redux Store:**
```javascript
// store/store.js - Updated
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import walletReducer from './slices/walletSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'refreshToken', 'isAuthenticated', 'user']
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items']
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    user: userReducer,
    products: productReducer,
    cart: persistReducer(cartPersistConfig, cartReducer),
    orders: orderReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
```

**File: `store/slices/productSlice.js`**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/products', {
        params: { category, page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    pagination: { page: 1, totalPages: 1 },
  },
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
```

**File: `store/slices/cartSlice.js`**
```javascript
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

**File: `store/slices/orderSlice.js`**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
```

**File: `store/slices/walletSlice.js`**
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const fetchWalletBalance = createAsyncThunk(
  'wallet/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/wallet/balance');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/wallet/transactions', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    balance: 0,
    transactions: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBalance.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
```

**Custom Hooks for State Management:**

**File: `hooks/useProducts.js`**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { fetchProducts, fetchProductById } from '@/store/slices/productSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { items, currentProduct, isLoading, error, pagination } = useSelector(
    (state) => state.products
  );
  
  const loadProducts = useCallback((filters) => {
    dispatch(fetchProducts(filters));
  }, [dispatch]);
  
  const loadProduct = useCallback((id) => {
    dispatch(fetchProductById(id));
  }, [dispatch]);
  
  return {
    products: items,
    currentProduct,
    isLoading,
    error,
    pagination,
    loadProducts,
    loadProduct,
  };
};
```

**File: `hooks/useCart.js`**
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  
  const addItem = useCallback((product, quantity) => {
    dispatch(addToCart({ product, quantity }));
  }, [dispatch]);
  
  const removeItem = useCallback((productId) => {
    dispatch(removeFromCart(productId));
  }, [dispatch]);
  
  const updateItemQuantity = useCallback((productId, quantity) => {
    dispatch(updateQuantity({ id: productId, quantity }));
  }, [dispatch]);
  
  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  return {
    items,
    total,
    itemCount: items.length,
    addItem,
    removeItem,
    updateItemQuantity,
    emptyCart,
  };
};
```

**Redux DevTools Configuration:**
```javascript
// Enable Redux DevTools in development
export const store = configureStore({
  reducer: {
    // ... reducers
  },
  devTools: process.env.NODE_ENV !== 'production',
});
```

---

### 📋 REDUX + JWT IMPLEMENTATION CHECKLIST

#### Backend Implementation Tasks
**JWT & Authentication:**
- [ ] Create `utils/jwtHelper.js` with token generation functions
- [ ] Create `middleware/authMiddleware.js` for token verification
- [ ] Create `middleware/roleMiddleware.js` for role-based access
- [ ] Implement `controllers/authController.js` with all auth endpoints
- [ ] Create `models/RefreshToken.js` for token storage
- [ ] Set up Redis for OTP storage and token blacklist
- [ ] Configure rate limiting on auth routes
- [ ] Add input validation with express-validator
- [ ] Implement token rotation on refresh
- [ ] Add logout token revocation

**Security:**
- [ ] Install and configure helmet for security headers
- [ ] Set up CORS with proper origin restrictions
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add XSS protection middleware
- [ ] Configure secure cookie settings
- [ ] Set strong JWT secrets in .env
- [ ] Enable HTTPS in production

**Database:**
- [ ] Create refresh_tokens table migration
- [ ] Add indexes for token lookups
- [ ] Create token cleanup job (remove expired)

#### Frontend Implementation Tasks
**Redux Setup:**
- [ ] Install Redux Toolkit and dependencies
- [ ] Create `store/store.js` with configureStore
- [ ] Configure Redux Persist with encryption
- [ ] Wrap app with Provider and PersistGate in `_app.js`
- [ ] Enable Redux DevTools for development

**Redux Slices:**
- [ ] Create `store/slices/authSlice.js` with async thunks
- [ ] Create `store/slices/userSlice.js` for profile management
- [ ] Create `store/slices/productSlice.js` for products
- [ ] Create `store/slices/cartSlice.js` for shopping cart
- [ ] Create `store/slices/orderSlice.js` for orders
- [ ] Create `store/slices/walletSlice.js` for wallet

**API & Utilities:**
- [ ] Create `utils/axios.js` with interceptors
- [ ] Create `utils/auth.js` with token utilities
- [ ] Create `services/authService.js` for API calls
- [ ] Implement automatic token refresh in interceptors
- [ ] Handle 401 responses with token refresh retry

**Custom Hooks:**
- [ ] Create `hooks/useAuth.js` for auth state
- [ ] Create `hooks/useProducts.js` for products
- [ ] Create `hooks/useCart.js` for cart operations
- [ ] Create `hooks/useOrders.js` for orders
- [ ] Create `hooks/useWallet.js` for wallet

**Components:**
- [ ] Create `components/auth/ProtectedRoute.jsx`
- [ ] Create `hoc/withAuth.js` HOC for route protection
- [ ] Create login page with Redux integration
- [ ] Create OTP input component
- [ ] Implement role-based navigation guards

**Pages:**
- [ ] Create `/pages/login.js` with Redux dispatch
- [ ] Create `/pages/register/[type].js` for registration
- [ ] Add protected routes for dashboards
- [ ] Create unauthorized access page

**Configuration:**
- [ ] Set up environment variables (.env.local)
- [ ] Configure API base URL
- [ ] Add Content Security Policy headers
- [ ] Configure next.config.js with security headers

#### Testing Tasks
- [ ] Test OTP send and verify flow
- [ ] Test token storage in Redux and localStorage
- [ ] Test token refresh mechanism
- [ ] Test protected routes redirect correctly
- [ ] Test role-based access control
- [ ] Test logout clears all state
- [ ] Test auth state persists on refresh
- [ ] Test multiple tabs sync auth state
- [ ] Test 401 responses trigger refresh
- [ ] Test expired token auto-refresh
- [ ] Load test rate limiting
- [ ] Security audit JWT implementation

#### Documentation Tasks
- [ ] Document API endpoints in Postman/Swagger
- [ ] Create README with setup instructions
- [ ] Document Redux state structure
- [ ] Add JSDoc comments to utility functions
- [ ] Create architecture diagram
- [ ] Document security measures

---

## 📦 PHASE 3: PRODUCT MANAGEMENT (Week 5-6)

### Week 5: Product CRUD & Media Upload

#### 5.1 Category Management (Admin)
**Backend:**
```javascript
POST   /api/admin/categories     // Create category
GET    /api/categories           // List categories
PUT    /api/admin/categories/:id // Update category
DELETE /api/admin/categories/:id // Delete category
```

**Create Categories:**
- Electronics
- Fashion & Apparel
- Home & Kitchen
- Beauty & Personal Care
- Sports & Fitness
- Books & Stationery
- Toys & Games
- Health & Wellness

#### 5.2 Product Management (Manufacturer)
**Backend:**
```javascript
POST   /api/manufacturer/products           // Create product
GET    /api/manufacturer/products           // List own products
GET    /api/manufacturer/products/:id       // Get single product
PUT    /api/manufacturer/products/:id       // Update product
DELETE /api/manufacturer/products/:id       // Delete product
POST   /api/manufacturer/products/:id/media // Upload images/videos
```

**Frontend:**
- [ ] `pages/manufacturer/products/new.js`
- [ ] `pages/manufacturer/products/[id]/edit.js`
- [ ] `pages/manufacturer/products/index.js`
- [ ] `components/manufacturer/ProductForm.jsx`

#### 5.3 Media Upload System
**Features:**
- Multiple image upload (drag & drop)
- Video upload to S3
- Image compression
- Preview before upload
- Progress indicator
- Image reordering
- Delete images

**Backend Service:**
```javascript
// services/uploadService.js
class UploadService {
  async uploadToS3(file, folder) {
    // Upload logic
  }
  
  async deleteFromS3(fileKey) {
    // Delete logic
  }
  
  async generateSignedUrl(fileKey) {
    // Generate temporary URL
  }
}
```

#### 5.4 Product Fields Implementation
**Form Fields:**
- Product Name (required)
- Product Description (rich text editor)
- Category (dropdown)
- Cost Price (number)
- Stock Quantity (number)
- Shipping Information (text)
- Delivery Time (in days)
- Product Images (multiple, max 10)
- Product Videos (max 3)
- Product Specifications (JSON)
- Weight & Dimensions

**Deliverables:**
- ✅ Category management working
- ✅ Product CRUD functional
- ✅ Media upload to S3 working
- ✅ Product form with validation

---

### Week 6: Product Approval & Pricing

#### 6.1 Admin - Product Approval System
**Backend:**
```javascript
GET   /api/admin/products/pending    // Pending products
PATCH /api/admin/products/:id/approve // Approve product
PATCH /api/admin/products/:id/reject  // Reject product
POST  /api/admin/products/:id/pricing // Set pricing
```

**Frontend:**
- [ ] `pages/admin/products/pending.js`
- [ ] Product review interface
- [ ] Pricing calculator
- [ ] Bulk approval

**Approval Workflow:**
1. Manufacturer submits product
2. Status: `pending`
3. Admin reviews product
4. Admin sets margins
5. Admin approves
6. Status: `approved`
7. Product goes live

#### 6.2 Pricing Calculator
**Backend Service:**
```javascript
// services/pricingService.js
class PricingService {
  calculatePrice(costPrice, resellerMargin, skaarviMargin) {
    const platformFee = costPrice * 0.05; // 5%
    const sellingPrice = costPrice + resellerMargin + skaarviMargin;
    
    return {
      costPrice,
      platformFee,
      resellerMargin,
      skaarviMargin,
      sellingPrice,
      manufacturerReceives: costPrice - platformFee,
      resellerReceives: resellerMargin,
      skaarviReceives: skaarviMargin + platformFee
    };
  }
}
```

**Frontend Component:**
- [ ] `components/admin/PricingCalculator.jsx`
- Real-time calculation
- Visual breakdown
- Profit margin percentages

#### 6.3 Product Catalog (Public)
**Customer-Facing Pages:**
- [ ] `pages/products/index.js` - Product listing
- [ ] `pages/products/[id].js` - Product detail
- [ ] Search & filters
- [ ] Pagination
- [ ] Sort options

**Features:**
- Grid/List view toggle
- Category filter
- Price range filter
- Search by name
- Sort by: Price, Newest, Popular
- Product image gallery
- Product video player
- Add to cart button
- Share button

#### 6.4 Reseller Product Catalog
- [ ] `pages/reseller/products/index.js`
- Shows profit margin
- Generate link button
- Download media button
- Download catalog PDF

**Deliverables:**
- ✅ Product approval workflow
- ✅ Pricing calculator working
- ✅ Public product catalog
- ✅ Reseller catalog with margins

---

## 🔗 PHASE 4: REFERRAL & TRACKING SYSTEM (Week 7-8)

### Week 7: Referral Link Generation

#### 7.1 Reseller Code Generation
**When reseller registers:**
```javascript
// Auto-generate unique code
const generateResellerCode = async () => {
  const lastReseller = await Reseller.findOne({
    order: [['created_at', 'DESC']]
  });
  
  const lastNumber = lastReseller ? 
    parseInt(lastReseller.reseller_code.replace('SKR', '')) : 1000;
  
  return `SKR${lastNumber + 1}`; // SKR1001, SKR1002...
};
```

#### 7.2 Link Generation System
**Backend:**
```javascript
POST /api/reseller/generate-link
Body: { productId: "uuid" }
Response: {
  link: "https://resell.skaarvi.com/product/123?ref=SKR1001",
  shortLink: "https://skrv.co/abc123",
  qrCode: "base64_image"
}
```

**Service:**
```javascript
// services/referralService.js
class ReferralService {
  generateLink(resellerId, productId) {
    const reseller = await Reseller.findByPk(resellerId);
    const baseUrl = process.env.FRONTEND_URL;
    return `${baseUrl}/product/${productId}?ref=${reseller.reseller_code}`;
  }
  
  async createShortLink(longUrl) {
    // Use bit.ly API or create custom short URLs
  }
  
  async generateQRCode(url) {
    // Generate QR code image
  }
}
```

#### 7.3 Link Tracking Middleware
**Frontend - Product Page:**
```javascript
// pages/product/[id].js
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get('ref');
  
  if (refCode) {
    // Store in cookie for 30 days
    Cookies.set('referral_code', refCode, { expires: 30 });
    
    // Track click
    axios.post('/api/referral/track-click', {
      productId: id,
      referralCode: refCode,
      userAgent: navigator.userAgent
    });
  }
}, []);
```

**Backend - Track Clicks:**
```javascript
POST /api/referral/track-click
// Log referral click in database
```

#### 7.4 Reseller Link Management UI
- [ ] `pages/reseller/links.js`
- [ ] Browse products
- [ ] Generate link button
- [ ] Copy link button
- [ ] Download QR code
- [ ] View link analytics
- [ ] Track clicks

**Deliverables:**
- ✅ Unique reseller codes generated
- ✅ Link generation working
- ✅ Click tracking implemented
- ✅ QR code generation

---

### Week 8: Conversion Tracking & Sponsor Tagging

#### 8.1 Conversion Tracking
**When order is placed:**
```javascript
// controllers/orderController.js
async createOrder(req, res) {
  const { productId, quantity, customerId } = req.body;
  const referralCode = req.cookies.referral_code;
  
  let resellerId = null;
  
  if (referralCode) {
    const reseller = await Reseller.findOne({
      where: { reseller_code: referralCode }
    });
    
    if (reseller) {
      resellerId = reseller.id;
      
      // Update referral click
      await ReferralClick.update({
        converted_to_order: true,
        customer_id: customerId,
        order_id: order.id
      }, {
        where: {
          reseller_id: resellerId,
          product_id: productId,
          customer_id: null
        }
      });
    }
  }
  
  // Create order with reseller_id
  const order = await Order.create({
    product_id: productId,
    customer_id: customerId,
    reseller_id: resellerId,
    quantity,
    // ... other fields
  });
}
```

#### 8.2 Sponsor Tagging System
**When customer becomes reseller:**
```javascript
// services/referralService.js
async tagSponsor(newResellerId, customerId) {
  // Find the reseller who referred this customer
  const referralClick = await ReferralClick.findOne({
    where: { customer_id: customerId },
    order: [['created_at', 'ASC']], // First click
    include: [{ model: Reseller }]
  });
  
  if (referralClick && referralClick.reseller_id) {
    // Tag sponsor
    await Reseller.update({
      sponsor_id: referralClick.reseller_id
    }, {
      where: { id: newResellerId }
    });
    
    // Log sponsorship
    await Sponsorship.create({
      sponsor_id: referralClick.reseller_id,
      referred_reseller_id: newResellerId,
      first_click_date: referralClick.clicked_at
    });
  }
}
```

#### 8.3 Referral Analytics
**Backend:**
```javascript
GET /api/reseller/analytics
Response: {
  totalClicks: 150,
  totalConversions: 23,
  conversionRate: 15.3,
  totalEarnings: 45600,
  topProducts: [...],
  clicksByDate: {...},
  referredCustomers: [...]
}
```

**Frontend:**
- [ ] `pages/reseller/analytics.js`
- Charts for clicks & conversions
- Top performing products
- Recent activity
- Referred customers list

#### 8.4 Media Download for Resellers
**Backend:**
```javascript
GET /api/reseller/product/:id/media
Response: {
  images: ["url1", "url2", ...],
  videos: ["url1", "url2", ...],
  catalogPdf: "url",
  productInfo: {...}
}

POST /api/reseller/product/:id/download-catalog
// Generate and return PDF
```

**Frontend:**
- [ ] Bulk download images
- [ ] Download videos
- [ ] Generate & download catalog PDF
- [ ] Product information sheet

**Deliverables:**
- ✅ Order conversion tracking
- ✅ Sponsor auto-tagging working
- ✅ Analytics dashboard
- ✅ Media download system

---

## 🛒 PHASE 5: CART & CHECKOUT (Week 9-10)

### Week 9: Shopping Cart System

#### 9.1 Cart Functionality
**Backend:**
```javascript
POST   /api/cart/add              // Add to cart
GET    /api/cart                  // Get cart items
PUT    /api/cart/update/:itemId   // Update quantity
DELETE /api/cart/remove/:itemId   // Remove item
DELETE /api/cart/clear            // Clear cart
```

**Database:**
```sql
CREATE TABLE cart_items (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER,
    added_at TIMESTAMP
);
```

**Frontend:**
- [ ] `components/cart/CartIcon.jsx` - Shows item count
- [ ] `components/cart/CartDrawer.jsx` - Slide-out cart
- [ ] `pages/cart.js` - Full cart page
- [ ] Add to cart button on product pages

**Features:**
- Add product to cart
- Update quantity (+ / -)
- Remove item
- Clear all items
- View total price
- Cart persists for logged-in users
- Guest cart (localStorage)

#### 9.2 Cart State Management
```javascript
// context/CartContext.js
const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  
  const addToCart = async (product, quantity) => {
    // Add to cart logic
  };
  
  const updateQuantity = async (itemId, quantity) => {
    // Update logic
  };
  
  const removeItem = async (itemId) => {
    // Remove logic
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

#### 9.3 Cart Validations
- Stock availability check
- Price change detection
- Product availability check
- Quantity limits

**Deliverables:**
- ✅ Cart functionality working
- ✅ Add/update/remove items
- ✅ Cart state management
- ✅ Cart validations

---

### Week 10: Checkout & Payment Integration

#### 10.1 Checkout Flow
**Backend:**
```javascript
POST /api/checkout/validate     // Validate cart & prices
POST /api/checkout/create-order // Create Razorpay order
POST /api/checkout/verify       // Verify payment
```

**Frontend Pages:**
- [ ] `pages/checkout/address.js` - Shipping address
- [ ] `pages/checkout/review.js` - Order review
- [ ] `pages/checkout/payment.js` - Payment page
- [ ] `pages/checkout/success.js` - Success page

**Checkout Steps:**
1. **Address:** Enter/select shipping address
2. **Review:** Review order items & total
3. **Payment:** Pay via Razorpay
4. **Confirmation:** Order success

#### 10.2 Address Management
**Backend:**
```javascript
POST   /api/customer/address     // Add address
GET    /api/customer/address     // List addresses
PUT    /api/customer/address/:id // Update address
DELETE /api/customer/address/:id // Delete address
PATCH  /api/customer/address/:id/default // Set default
```

**Database:**
```sql
CREATE TABLE addresses (
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES users(id),
    full_name VARCHAR(255),
    mobile VARCHAR(15),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(6),
    is_default BOOLEAN DEFAULT false,
    address_type ENUM('home', 'office', 'other')
);
```

#### 10.3 Razorpay Integration
**Install SDK:**
```bash
npm install razorpay
```

**Backend Service:**
```javascript
// services/paymentService.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

class PaymentService {
  async createOrder(amount, currency = 'INR') {
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `order_${Date.now()}`
    };
    
    return await razorpay.orders.create(options);
  }
  
  async verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const crypto = require('crypto');
    const text = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');
    
    return expectedSignature === razorpaySignature;
  }
}
```

**Frontend Integration:**
```javascript
// components/checkout/RazorpayButton.jsx
const handlePayment = async () => {
  // Create order
  const { data } = await axios.post('/api/checkout/create-order', {
    amount: cartTotal,
    items: cartItems
  });
  
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: data.amount,
    currency: data.currency,
    order_id: data.razorpayOrderId,
    name: 'Skaarvi Resell',
    description: 'Product Purchase',
    handler: async (response) => {
      // Verify payment
      const result = await axios.post('/api/checkout/verify', {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        orderId: data.orderId
      });
      
      if (result.data.success) {
        router.push(`/checkout/success?orderId=${data.orderId}`);
      }
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.mobile
    }
  };
  
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

#### 10.4 Order Creation Logic
```javascript
// controllers/orderController.js
async createOrder(req, res) {
  const { items, addressId, paymentMethod } = req.body;
  const customerId = req.user.id;
  const referralCode = req.cookies.referral_code;
  
  // Find reseller if referral exists
  let resellerId = null;
  if (referralCode) {
    const reseller = await Reseller.findOne({
      where: { reseller_code: referralCode }
    });
    resellerId = reseller?.id;
  }
  
  // Create order for each item
  const orders = [];
  for (const item of items) {
    const product = await Product.findByPk(item.productId, {
      include: [ProductPricing, Manufacturer]
    });
    
    // Calculate commissions
    const pricing = product.product_pricing;
    const quantity = item.quantity;
    
    const platformFee = (pricing.cost_price * quantity * 5) / 100;
    const resellerCommission = resellerId ? pricing.reseller_margin * quantity : 0;
    const skaarviCommission = (pricing.skaarvi_margin * quantity) + platformFee;
    
    const order = await Order.create({
      order_number: generateOrderNumber(),
      customer_id: customerId,
      reseller_id: resellerId,
      product_id: product.id,
      manufacturer_id: product.manufacturer_id,
      quantity,
      customer_price: pricing.selling_price * quantity,
      cost_price: pricing.cost_price * quantity,
      platform_fee: platformFee,
      reseller_commission: resellerCommission,
      skaarvi_commission: skaarviCommission,
      order_status: 'new',
      payment_status: 'pending'
    });
    
    orders.push(order);
  }
  
  // Create Razorpay order
  const totalAmount = orders.reduce((sum, o) => sum + o.customer_price, 0);
  const razorpayOrder = await paymentService.createOrder(totalAmount);
  
  res.json({
    success: true,
    orders,
    razorpayOrderId: razorpayOrder.id,
    amount: totalAmount
  });
}
```

**Deliverables:**
- ✅ Complete checkout flow
- ✅ Address management
- ✅ Razorpay payment integration
- ✅ Order creation with commission

---

## 💰 PHASE 6: WALLET & COMMISSION SYSTEM (Week 11-12)

### Week 11: Wallet Implementation

#### 11.1 Wallet System
**Database Schema:**
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    reseller_id UUID REFERENCES resellers(id) UNIQUE,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    pending_earnings DECIMAL(10,2) DEFAULT 0,
    approved_earnings DECIMAL(10,2) DEFAULT 0,
    withdrawn_amount DECIMAL(10,2) DEFAULT 0,
    available_balance DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMP
);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id),
    order_id UUID REFERENCES orders(id),
    transaction_type ENUM('credit', 'debit'),
    amount DECIMAL(10,2),
    description TEXT,
    status ENUM('pending', 'completed', 'failed'),
    created_at TIMESTAMP
);
```

**Backend:**
```javascript
GET /api/reseller/wallet              // Get wallet balance
GET /api/reseller/wallet/transactions // Transaction history
```

#### 11.2 Auto-Commission Credit
**When order is delivered:**
```javascript
// services/commissionService.js
async creditCommission(orderId) {
  const order = await Order.findByPk(orderId, {
    include: [Reseller]
  });
  
  if (!order.reseller_id) return;
  
  // Get or create wallet
  let wallet = await Wallet.findOne({
    where: { reseller_id: order.reseller_id }
  });
  
  if (!wallet) {
    wallet = await Wallet.create({
      reseller_id: order.reseller_id
    });
  }
  
  // Credit commission
  await wallet.increment({
    total_earnings: order.reseller_commission,
    pending_earnings: order.reseller_commission
  });
  
  // Create transaction
  await WalletTransaction.create({
    wallet_id: wallet.id,
    order_id: order.id,
    transaction_type: 'credit',
    amount: order.reseller_commission,
    description: `Commission for order #${order.order_number}`,
    status: 'pending'
  });
  
  // Send notification
  await notificationService.send({
    userId: order.reseller.user_id,
    type: 'commission_credited',
    message: `You earned ₹${order.reseller_commission} from order #${order.order_number}`
  });
}
```

#### 11.3 Commission Approval Flow
**After return window expires (7 days):**
```javascript
// cron job runs daily
async approveCommissions() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const ordersToApprove = await Order.findAll({
    where: {
      order_status: 'delivered',
      delivered_at: { [Op.lte]: sevenDaysAgo },
      commission_approved: false
    }
  });
  
  for (const order of ordersToApprove) {
    if (!order.reseller_id) continue;
    
    const wallet = await Wallet.findOne({
      where: { reseller_id: order.reseller_id }
    });
    
    // Move from pending to approved
    await wallet.decrement('pending_earnings', {
      by: order.reseller_commission
    });
    
    await wallet.increment({
      approved_earnings: order.reseller_commission,
      available_balance: order.reseller_commission
    });
    
    // Update transaction status
    await WalletTransaction.update({
      status: 'completed'
    }, {
      where: {
        order_id: order.id,
        status: 'pending'
      }
    });
    
    // Mark order commission as approved
    await order.update({ commission_approved: true });
  }
}
```

#### 11.4 Wallet UI
**Frontend:**
- [ ] `pages/reseller/wallet.js`
- [ ] `components/wallet/WalletCard.jsx`
- [ ] `components/wallet/TransactionList.jsx`

**Features:**
- Current balance display
- Pending vs approved earnings
- Transaction history
- Filter by date range
- Export transactions
- Withdrawal button

**Deliverables:**
- ✅ Wallet system functional
- ✅ Auto commission credit
- ✅ Commission approval workflow
- ✅ Wallet UI complete

---

### Week 12: Withdrawal System

#### 12.1 Withdrawal Request
**Backend:**
```javascript
POST /api/reseller/withdrawal/request
Body: {
  amount: 5000,
  paymentMethod: 'bank_transfer', // or 'upi'
  bankDetails: {...} // or upiId
}
```

**Database:**
```sql
CREATE TABLE withdrawal_requests (
    id UUID PRIMARY KEY,
    reseller_id UUID REFERENCES resellers(id),
    amount DECIMAL(10,2),
    payment_method ENUM('bank_transfer', 'upi'),
    account_details JSONB,
    status ENUM('pending', 'approved', 'paid', 'rejected'),
    admin_note TEXT,
    requested_at TIMESTAMP,
    processed_at TIMESTAMP
);
```

**Validation:**
- Minimum withdrawal: ₹500
- Maximum per request: ₹50,000
- Available balance must be sufficient
- Reseller must be verified

#### 12.2 Withdrawal Processing
**Backend Service:**
```javascript
// services/withdrawalService.js
async requestWithdrawal(resellerId, amount, paymentDetails) {
  const wallet = await Wallet.findOne({
    where: { reseller_id: resellerId }
  });
  
  // Validations
  if (wallet.available_balance < amount) {
    throw new Error('Insufficient balance');
  }
  
  if (amount < 500) {
    throw new Error('Minimum withdrawal amount is ₹500');
  }
  
  // Create withdrawal request
  const withdrawal = await WithdrawalRequest.create({
    reseller_id: resellerId,
    amount,
    payment_method: paymentDetails.method,
    account_details: paymentDetails,
    status: 'pending',
    requested_at: new Date()
  });
  
  // Lock amount in wallet
  await wallet.decrement('available_balance', { by: amount });
  
  // Create debit transaction
  await WalletTransaction.create({
    wallet_id: wallet.id,
    transaction_type: 'debit',
    amount,
    description: `Withdrawal request #${withdrawal.id}`,
    status: 'pending'
  });
  
  // Notify admin
  await notificationService.notifyAdmin({
    type: 'withdrawal_request',
    message: `New withdrawal request of ₹${amount} from ${reseller.name}`
  });
  
  return withdrawal;
}
```

#### 12.3 Admin - Withdrawal Approval
**Backend:**
```javascript
GET   /api/admin/withdrawals           // List all withdrawals
GET   /api/admin/withdrawals/pending   // Pending requests
PATCH /api/admin/withdrawals/:id/approve
PATCH /api/admin/withdrawals/:id/reject
POST  /api/admin/withdrawals/:id/mark-paid
```

**Frontend:**
- [ ] `pages/admin/withdrawals.js`
- [ ] Pending requests list
- [ ] Reseller details
- [ ] Bank/UPI details display
- [ ] Approve/reject buttons
- [ ] Add admin notes

**Approval Flow:**
1. Reseller submits request
2. Admin reviews
3. Admin approves
4. Admin initiates payment
5. Admin marks as paid
6. Wallet updated

#### 12.4 Withdrawal History
**Reseller View:**
- [ ] `pages/reseller/withdrawals.js`
- All withdrawal requests
- Status tracking
- Filter by status
- Date range filter

**Deliverables:**
- ✅ Withdrawal request system
- ✅ Admin approval interface
- ✅ Payment processing
- ✅ Transaction logging

---

## 📊 PHASE 7: ORDER MANAGEMENT (Week 13-14)

### Week 13: Order Processing

#### 13.1 Order Management Dashboard
**Admin:**
- [ ] `pages/admin/orders.js`
- All orders list
- Filter by status
- Filter by manufacturer/reseller
- Date range filter
- Export orders

**Manufacturer:**
- [ ] `pages/manufacturer/orders.js`
- Orders for their products
- Update order status
- Generate invoice
- View customer details

**Reseller:**
- [ ] `pages/reseller/orders.js`
- Orders from their referrals
- Commission details
- Track order status

**Customer:**
- [ ] `pages/customer/orders.js`
- Their order history
- Track order
- Cancel order
- Return request

#### 13.2 Order Status Updates
**Backend:**
```javascript
PATCH /api/orders/:id/status
Body: {
  status: 'processing', // or 'shipped', 'delivered', etc.
  trackingNumber: 'ABC123',
  notes: 'Order dispatched'
}
```

**Status Flow:**
```
new → processing → shipped → delivered
        ↓
    cancelled / returned
```

**When status changes:**
- Update order status
- Create status history entry
- Send notification to customer
- Send notification to reseller
- If delivered: start commission approval timer

#### 13.3 Order Details Page
**Frontend:**
- [ ] `pages/orders/[id].js`
- Order information
- Product details
- Customer details
- Shipping address
- Payment details
- Status timeline
- Tracking link (if shipped)

**For Manufacturer:**
- Update status button
- Add tracking number
- Generate shipping label
- View commission breakdown

#### 13.4 Order Cancellation & Returns
**Backend:**
```javascript
POST /api/orders/:id/cancel
POST /api/orders/:id/return
```

**Cancellation Rules:**
- Can cancel before shipped
- Full refund
- Commission not credited

**Return Rules:**
- Can return within 7 days of delivery
- Must provide reason
- Admin approval required
- Refund after product received

**Refund Logic:**
```javascript
async processRefund(orderId) {
  const order = await Order.findByPk(orderId);
  
  // Initiate Razorpay refund
  await razorpay.payments.refund(order.razorpay_payment_id, {
    amount: order.customer_price * 100
  });
  
  // If commission was credited, reverse it
  if (order.reseller_id && order.commission_approved) {
    const wallet = await Wallet.findOne({
      where: { reseller_id: order.reseller_id }
    });
    
    await wallet.decrement({
      total_earnings: order.reseller_commission,
      approved_earnings: order.reseller_commission,
      available_balance: order.reseller_commission
    });
    
    await WalletTransaction.create({
      wallet_id: wallet.id,
      order_id: order.id,
      transaction_type: 'debit',
      amount: order.reseller_commission,
      description: 'Commission reversed due to refund',
      status: 'completed'
    });
  }
  
  // Update order status
  await order.update({
    order_status: 'returned',
    payment_status: 'refunded'
  });
}
```

**Deliverables:**
- ✅ Order management dashboards
- ✅ Status update system
- ✅ Order details page
- ✅ Cancellation & returns

---

### Week 14: Notifications & Emails

#### 14.1 Notification System Architecture
**Database:**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP
);
```

**Backend Service:**
```javascript
// services/notificationService.js
class NotificationService {
  async send(userId, type, data) {
    // Create in-app notification
    await Notification.create({
      user_id: userId,
      type,
      title: this.getTitle(type),
      message: this.getMessage(type, data),
      data
    });
    
    // Send email
    await this.sendEmail(userId, type, data);
    
    // Send SMS
    await this.sendSMS(userId, type, data);
    
    // Send WhatsApp
    await this.sendWhatsApp(userId, type, data);
  }
}
```

#### 14.2 Email Templates
**Create templates for:**
- Welcome email (registration)
- OTP email
- Order confirmation
- Order shipped
- Order delivered
- Commission credited
- Withdrawal approved
- Product approved
- Monthly earnings report

**Use SendGrid or AWS SES:**
```javascript
// services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async sendOrderConfirmation(order) {
  const msg = {
    to: order.customer.email,
    from: 'noreply@skaarvi.com',
    subject: `Order Confirmation - ${order.order_number}`,
    templateId: 'd-xyz123', // SendGrid template ID
    dynamicTemplateData: {
      orderNumber: order.order_number,
      products: order.items,
      total: order.customer_price,
      deliveryDate: order.estimated_delivery
    }
  };
  
  await sgMail.send(msg);
}
```

#### 14.3 WhatsApp Notifications
**Use WhatsApp Business API:**
```javascript
// services/whatsappService.js
async sendOrderUpdate(mobile, orderNumber, status) {
  const message = this.getMessageTemplate(status, orderNumber);
  
  await axios.post('https://api.whatsapp.com/send', {
    phone: mobile,
    message
  });
}
```

**WhatsApp Templates:**
- Order placed
- Order shipped (with tracking)
- Order delivered
- Commission earned

#### 14.4 SMS Notifications
**Use MSG91 or Twilio:**
```javascript
// services/smsService.js
async sendOTP(mobile, otp) {
  const message = `Your OTP for Skaarvi Resell is ${otp}. Valid for 5 minutes.`;
  
  await axios.post('https://api.msg91.com/api/v5/flow/', {
    mobile,
    message,
    authkey: process.env.MSG91_AUTH_KEY
  });
}
```

#### 14.5 In-App Notifications
**Frontend:**
- [ ] `components/NotificationBell.jsx`
- [ ] `components/NotificationDropdown.jsx`
- [ ] Mark as read functionality
- [ ] Notification preferences

**Real-time with Socket.io:**
```javascript
// Server
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });
});

// Emit notification
io.to(userId).emit('notification', notificationData);
```

**Deliverables:**
- ✅ Notification system
- ✅ Email templates
- ✅ WhatsApp integration
- ✅ SMS integration
- ✅ In-app notifications

---

## 📈 PHASE 8: ANALYTICS & REPORTS (Week 15)

### Week 15: Dashboards & Reports

#### 15.1 Admin Dashboard
**Key Metrics:**
- Total revenue
- Total orders
- Total manufacturers
- Total resellers
- Total customers
- Pending approvals
- Pending withdrawals
- Commission payouts

**Charts:**
- Revenue trend (daily/monthly)
- Orders by status
- Top manufacturers
- Top resellers
- Category-wise sales
- Geographic distribution

**Backend:**
```javascript
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/revenue-chart?period=30days
GET /api/admin/dashboard/top-performers
```

#### 15.2 Manufacturer Dashboard
**Key Metrics:**
- Total products
- Active products
- Total orders
- Total earnings
- Pending earnings
- Top selling products
- Stock alerts

**Charts:**
- Sales trend
- Product performance
- Category-wise sales

**Backend:**
```javascript
GET /api/manufacturer/dashboard/stats
GET /api/manufacturer/dashboard/sales-chart
GET /api/manufacturer/dashboard/top-products
```

#### 15.3 Reseller Dashboard
**Key Metrics:**
- Total clicks
- Total orders
- Conversion rate
- Total earnings
- Pending earnings
- Available balance
- Top products
- Referral count

**Charts:**
- Earnings trend
- Click vs conversion
- Product performance

**Backend:**
```javascript
GET /api/reseller/dashboard/stats
GET /api/reseller/dashboard/earnings-chart
GET /api/reseller/dashboard/performance
```

#### 15.4 Reports Generation
**Admin Reports:**
- [ ] Sales report (date range)
- [ ] Commission report
- [ ] Manufacturer earnings
- [ ] Reseller earnings
- [ ] Product performance
- [ ] Category report

**Export Options:**
- CSV
- Excel
- PDF

**Backend:**
```javascript
GET /api/reports/sales?from=2024-01-01&to=2024-12-31&format=csv
GET /api/reports/commissions?month=2024-01&format=pdf
```

#### 15.5 Leaderboard
**Monthly Leaderboard:**
- Top resellers by sales
- Top resellers by earnings
- Top resellers by referrals
- Top products
- Top manufacturers

**Frontend:**
- [ ] `pages/leaderboard.js`
- Filters (monthly/all-time)
- Rank display
- Rewards badge

**Deliverables:**
- ✅ All dashboards complete
- ✅ Charts implemented
- ✅ Reports generation
- ✅ Leaderboard

---

## 🔍 PHASE 9: SEARCH & FILTERS (Week 16)

### Week 16: Advanced Search

#### 16.1 Product Search
**Backend - Elasticsearch or PostgreSQL Full-Text:**
```javascript
GET /api/products/search?q=laptop&category=electronics&minPrice=10000&maxPrice=50000&sortBy=price_low
```

**Search Fields:**
- Product name
- Product description
- Category
- Manufacturer name

#### 16.2 Filters
**Available Filters:**
- Category (multi-select)
- Price range (slider)
- Manufacturer
- Rating
- Availability (in stock)
- Discount/Profit margin (for resellers)
- Newest first
- Best sellers

#### 16.3 Sorting Options
- Price: Low to High
- Price: High to Low
- Newest First
- Best Selling
- Highest Profit (for resellers)

#### 16.4 Frontend Implementation
- [ ] `components/search/SearchBar.jsx`
- [ ] `components/search/FilterSidebar.jsx`
- [ ] `components/search/SortDropdown.jsx`
- [ ] Auto-suggest in search
- Search history
- Clear filters

**Deliverables:**
- ✅ Search functionality
- ✅ Advanced filters
- ✅ Sort options
- ✅ Filter UI

---

## 🧪 PHASE 10: TESTING & OPTIMIZATION (Week 17-18)

### Week 17: Testing

#### 17.1 Unit Testing
**Backend:**
```bash
npm install jest supertest --save-dev
```

**Test Files:**
- `tests/auth.test.js`
- `tests/products.test.js`
- `tests/orders.test.js`
- `tests/wallet.test.js`
- `tests/referral.test.js`

**Example:**
```javascript
describe('Pricing Service', () => {
  test('should calculate correct selling price', () => {
    const pricing = pricingService.calculatePrice(1000, 200, 100);
    expect(pricing.sellingPrice).toBe(1300);
    expect(pricing.platformFee).toBe(50);
  });
});
```

#### 17.2 Integration Testing
- Test complete flows
- Order creation flow
- Commission credit flow
- Withdrawal flow
- Referral tracking flow

#### 17.3 Frontend Testing
```bash
npm install @testing-library/react @testing-library/jest-dom --save-dev
```

- Component tests
- Page tests
- User interaction tests

#### 17.4 Manual Testing Checklist
**User Flows:**
- [ ] Manufacturer registration → product upload → approval
- [ ] Reseller registration → browse → generate link
- [ ] Customer clicks link → purchase → commission credit
- [ ] Customer becomes reseller → sponsor tagged
- [ ] Order delivery → commission approved
- [ ] Withdrawal request → admin approval → payment
- [ ] Order cancellation → refund
- [ ] Product return → commission reversal

**Edge Cases:**
- Invalid referral codes
- Expired OTPs
- Insufficient stock
- Payment failures
- Duplicate orders
- Concurrent withdrawals

**Deliverables:**
- ✅ Unit tests written
- ✅ Integration tests
- ✅ Manual testing complete
- ✅ Bug fixes

---

### Week 18: Performance & Security

#### 18.1 Performance Optimization
**Backend:**
- Database indexing
- Query optimization
- Caching (Redis)
- API response compression
- Lazy loading

**Database Indexes:**
```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_reseller ON orders(reseller_id);
CREATE INDEX idx_referral_clicks_reseller ON referral_clicks(reseller_id);
CREATE INDEX idx_reseller_code ON resellers(reseller_code);
```

**Redis Caching:**
```javascript
// Cache product listings
const cacheKey = `products:category:${categoryId}`;
let products = await redis.get(cacheKey);

if (!products) {
  products = await Product.findAll({ where: { category_id: categoryId }});
  await redis.setex(cacheKey, 3600, JSON.stringify(products));
}
```

**Frontend:**
- Image optimization (Next.js Image)
- Code splitting
- Lazy loading components
- CDN for static assets

#### 18.2 Security Measures
**Backend:**
- [ ] Input validation (Joi)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Helmet.js for headers
- [ ] Secure cookies
- [ ] Password hashing (if used)
- [ ] Environment variables

**Rate Limiting:**
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', apiLimiter);
```

**Input Validation:**
```javascript
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  cost_price: Joi.number().min(0).required(),
  stock_quantity: Joi.number().integer().min(0).required()
});
```

#### 18.3 SEO Optimization
**Frontend:**
- Meta tags
- Open Graph tags
- Sitemap.xml
- Robots.txt
- Schema markup for products
- Canonical URLs

```javascript
// pages/product/[id].js
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  
  return {
    title: `${product.name} - Skaarvi Resell`,
    description: product.description,
    openGraph: {
      images: [product.images[0]]
    }
  };
}
```

#### 18.4 Mobile Responsiveness
- Test on multiple devices
- Touch-friendly UI
- Mobile navigation
- Responsive images
- Fast load times

**Deliverables:**
- ✅ Performance optimized
- ✅ Security hardened
- ✅ SEO implemented
- ✅ Mobile responsive

---

## 🚀 PHASE 11: DEPLOYMENT & LAUNCH (Week 19-20)

### Week 19: Pre-Launch Preparation

#### 19.1 Production Environment Setup
**AWS Services:**
- [ ] EC2 instance for backend
- [ ] RDS for PostgreSQL
- [ ] S3 for media storage
- [ ] CloudFront CDN
- [ ] Route 53 for DNS
- [ ] Load Balancer
- [ ] Auto Scaling

**Domain Setup:**
- [ ] Purchase domain: resell.skaarvi.com
- [ ] Configure DNS
- [ ] SSL certificate (AWS Certificate Manager)

#### 19.2 Database Migration
- [ ] Backup development database
- [ ] Run migrations on production
- [ ] Seed initial data
- [ ] Test connections

#### 19.3 Environment Configuration
**Production `.env`:**
```
NODE_ENV=production
DATABASE_URL=postgresql://...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
JWT_SECRET=...
FRONTEND_URL=https://resell.skaarvi.com
```

#### 19.4 CI/CD Pipeline
**GitHub Actions:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to AWS
        run: |
          npm install
          npm run build
          pm2 restart all
```

#### 19.5 Monitoring Setup
- [ ] Setup error tracking (Sentry)
- [ ] Setup uptime monitoring
- [ ] Setup performance monitoring
- [ ] Setup logs (CloudWatch)

**Deliverables:**
- ✅ Production environment ready
- ✅ Domain configured
- ✅ SSL certificates
- ✅ Monitoring setup

---

### Week 20: Launch & Post-Launch

#### 20.1 Final Testing
- [ ] Complete end-to-end testing
- [ ] Load testing
- [ ] Security audit
- [ ] Cross-browser testing
- [ ] Mobile testing

#### 20.2 Data Backup
- [ ] Setup automated backups
- [ ] Test backup restoration
- [ ] Document backup procedure

#### 20.3 Documentation
**Create Documentation:**
- [ ] User guide for manufacturers
- [ ] User guide for resellers
- [ ] Admin manual
- [ ] API documentation
- [ ] Troubleshooting guide
- [ ] FAQ

#### 20.4 Soft Launch
- [ ] Invite 10 manufacturers
- [ ] Invite 50 resellers
- [ ] Monitor system
- [ ] Gather feedback
- [ ] Fix critical issues

#### 20.5 Marketing Launch
- [ ] Social media announcement
- [ ] Email campaign
- [ ] Press release
- [ ] Onboarding webinar
- [ ] Tutorial videos

#### 20.6 Post-Launch Monitoring
**First Week:**
- Monitor server performance
- Track errors
- User feedback
- Quick bug fixes
- Performance tuning

**First Month:**
- Collect user feedback
- Plan improvements
- Add requested features
- Optimize based on usage

**Deliverables:**
- ✅ Platform launched
- ✅ Users onboarded
- ✅ Documentation complete
- ✅ Monitoring active

---

## 📱 PHASE 12: MOBILE APPS (Future - Week 21+)

### Android & iOS App Development
- React Native app
- Same backend APIs
- Push notifications
- Offline support
- App store deployment

---

## 🎯 PHASE 13: ADVANCED FEATURES (Future)

### Future Enhancements
- [ ] AI product description generator
- [ ] AI image generator
- [ ] Multi-level referral rewards
- [ ] Subscription plans for manufacturers
- [ ] Live chat support
- [ ] Video consultations
- [ ] AR product preview
- [ ] Multi-language support
- [ ] Multi-currency support
- [ ] Inventory management system
- [ ] Automated email campaigns
- [ ] Social media integration
- [ ] Affiliate marketing tools

---

## 📊 KEY PERFORMANCE INDICATORS (KPIs)

### Track These Metrics:
1. **User Growth:**
   - New manufacturers/month
   - New resellers/month
   - New customers/month

2. **Engagement:**
   - Daily active users
   - Products listed
   - Links generated
   - Conversion rate

3. **Revenue:**
   - Total GMV (Gross Merchandise Value)
   - Platform revenue
   - Average order value
   - Commission per reseller

4. **Performance:**
   - Page load time
   - API response time
   - Uptime percentage
   - Error rate

---

## 🛠️ TECHNOLOGY STACK SUMMARY

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| ORM | Sequelize |
| Authentication | JWT + OTP |
| File Storage | AWS S3 |
| Payment | Razorpay |
| Email | SendGrid / AWS SES |
| SMS | MSG91 / Twilio |
| WhatsApp | WhatsApp Business API |
| Caching | Redis |
| Hosting | AWS (EC2, RDS, S3) |
| CDN | CloudFront |
| Monitoring | Sentry, CloudWatch |
| CI/CD | GitHub Actions |

---

## 💡 BEST PRACTICES

1. **Code Quality:**
   - ESLint for code linting
   - Prettier for code formatting
   - Git hooks for pre-commit checks
   - Code reviews before merge

2. **Version Control:**
   - Feature branches
   - Pull requests
   - Semantic versioning
   - Changelog maintenance

3. **Security:**
   - Regular security audits
   - Dependency updates
   - Penetration testing
   - Data encryption

4. **Documentation:**
   - Code comments
   - API documentation
   - User guides
   - Technical documentation

5. **Testing:**
   - Unit tests (>80% coverage)
   - Integration tests
   - End-to-end tests
   - Performance tests

---

## ⚠️ CRITICAL SUCCESS FACTORS

1. **Accurate Commission Tracking** - Must be 100% accurate
2. **Referral Link Tracking** - Core business logic
3. **Wallet System** - Handle money carefully
4. **Payment Gateway Integration** - Must be secure
5. **User Experience** - Simple and intuitive
6. **Performance** - Fast load times
7. **Mobile Responsive** - Works on all devices
8. **Support System** - Quick resolution

---

## 📞 SUPPORT STRUCTURE

**Post-Launch Support:**
- Technical support team
- Customer service team
- Manufacturer support
- Reseller support
- 24/7 monitoring
- Emergency hotline

---

## 🎉 PROJECT MILESTONES

- [x] Phase 1: Foundation Complete
- [x] Phase 2: Authentication Complete
- [x] Phase 3: Product Management Complete
- [x] Phase 4: Referral System Complete
- [x] Phase 5: Cart & Checkout Complete
- [x] Phase 6: Wallet & Commission Complete
- [x] Phase 7: Order Management Complete
- [x] Phase 8: Analytics & Reports Complete
- [x] Phase 9: Search & Filters Complete
- [x] Phase 10: Testing Complete
- [x] Phase 11: Deployment Complete
- [ ] Phase 12: Mobile Apps (Future)
- [ ] Phase 13: Advanced Features (Future)

---

## 📝 NOTES

- Always test on staging before production
- Keep backups before major changes
- Monitor server logs daily
- Respond to user feedback quickly
- Plan for scalability from day one
- Document everything
- Keep security as top priority

---

**Project Start Date:** Week 1
**Target Launch Date:** Week 20
**Post-Launch Support:** Ongoing

---

**Document Version:** 1.0
**Last Updated:** 2026-06-07
**Created By:** Development Team
**For:** Skaarvi Resell Marketplace

---

## 🚦 READY TO START?

Begin with **Phase 1: Foundation & Setup** and follow the week-by-week plan. Each phase builds on the previous one, so complete them in order for best results.

Good luck with the development! 🚀

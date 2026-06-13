# Authentication System Documentation

## Overview
Complete JWT-based authentication system with OTP verification for manufacturer registration and login.

## Features
- ✅ Mobile OTP Authentication
- ✅ JWT Token with Claims (userId, role, email, etc.)
- ✅ Refresh Token Support
- ✅ Manufacturer Registration with Document Upload
- ✅ Protected Routes with Middleware
- ✅ Redux State Management
- ✅ Automatic Token Refresh

## Database Models

### User Model
- `id` - UUID (Primary Key)
- `mobile` - Unique phone number
- `email` - Email address
- `role` - Enum: admin, manufacturer, reseller, customer
- `isActive` - Account status
- `isVerified` - Verification status
- `lastLogin` - Last login timestamp

### Manufacturer Model
- `id` - UUID (Primary Key)
- `userId` - Foreign Key to User
- `companyName` - Company name
- `ownerName` - Owner name
- `businessType` - Business type
- `gstNumber` - GST number (unique)
- `panNumber` - PAN number (unique)
- `address, city, state, pincode` - Address fields
- `status` - Enum: pending, approved, rejected, suspended
- `documents` - JSON (uploaded document URLs)

### OTP Model
- `id` - UUID (Primary Key)
- `mobile` - Phone number
- `otp` - 6-digit OTP
- `expiresAt` - Expiry timestamp
- `verified` - Verification status

## API Endpoints

### Authentication Endpoints

#### 1. Send OTP
```
POST /api/auth/send-otp
```
**Request:**
```json
{
  "mobile": "+919876543210"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "OTP sent successfully",
  "otp": "123456"  // Only in development
}
```

#### 2. Verify OTP & Login
```
POST /api/auth/verify-otp
```
**Request:**
```json
{
  "mobile": "+919876543210",
  "otp": "123456"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "mobile": "+919876543210",
      "email": "user@example.com",
      "role": "manufacturer",
      "isActive": true,
      "isVerified": true,
      "manufacturer": {
        "id": "uuid",
        "companyName": "ABC Company",
        "ownerName": "John Doe",
        "status": "approved"
      }
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "isNewUser": false
  }
}
```

#### 3. Register Manufacturer
```
POST /api/auth/register
```
**Request:** `multipart/form-data`
- `mobile` - Phone number
- `email` - Email address
- `companyName` - Company name
- `ownerName` - Owner name
- `businessType` - Business type
- `gstNumber` - GST number
- `panNumber` - PAN number
- `address` - Business address
- `city` - City
- `state` - State
- `pincode` - Pincode
- `gstCertificate` - File (GST certificate)
- `panCard` - File (PAN card)
- `addressProof` - File (Address proof)

**Response:**
```json
{
  "status": "success",
  "message": "Registration submitted successfully",
  "data": {
    "userId": "uuid",
    "manufacturerId": "uuid",
    "status": "pending"
  }
}
```

#### 4. Get Current User Profile
```
GET /api/auth/me
Authorization: Bearer {token}
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "mobile": "+919876543210",
    "email": "user@example.com",
    "role": "manufacturer",
    "manufacturer": { /* manufacturer details */ }
  }
}
```

#### 5. Refresh Token
```
POST /api/auth/refresh
```
**Request:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "new_jwt_access_token"
  }
}
```

## JWT Claims Structure

### Access Token Payload
```json
{
  "userId": "uuid",
  "mobile": "+919876543210",
  "email": "user@example.com",
  "role": "manufacturer",
  "isVerified": true,
  "iat": 1234567890,
  "exp": 1234667890
}
```

### Token Expiry
- Access Token: 7 days (configurable via JWT_EXPIRE)
- Refresh Token: 30 days (configurable via JWT_REFRESH_EXPIRE)

## Authentication Middleware

### Usage in API Routes
```javascript
import { authMiddleware } from '@/middleware/auth';

export async function GET(request) {
  const authResult = await authMiddleware(request);
  
  if (authResult instanceof NextResponse) {
    return authResult; // Return error
  }
  
  // authResult contains: userId, mobile, email, role, isVerified
  // Proceed with authenticated logic
}
```

### With Role-Based Access
```javascript
import { withAuth } from '@/middleware/auth';

export const GET = withAuth(
  async (request, context) => {
    const user = context.user; // Contains user claims
    // Your logic here
  },
  ['manufacturer'] // Allowed roles
);
```

## Frontend Integration

### API Client (lib/api.js)
Axios instance with:
- Automatic token injection
- Token refresh on 401
- Error handling
- Type-safe API calls

### Usage Example
```javascript
import { authAPI } from '@/lib/api';

// Send OTP
const response = await authAPI.sendOtp('+919876543210');

// Verify OTP
const result = await authAPI.verifyOtp('+919876543210', '123456');

// Store tokens
localStorage.setItem('token', result.data.token);
localStorage.setItem('refreshToken', result.data.refreshToken);

// Update Redux
dispatch(setCredentials(result.data));
```

### Redux Integration
```javascript
import { setCredentials, logout } from '@/store/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';

// Get auth state
const { user, token, isAuthenticated } = useSelector(state => state.auth);

// Update auth
dispatch(setCredentials({ user, token, refreshToken }));

// Logout
dispatch(logout());
```

## Authentication Flow

### Login Flow
1. User enters mobile number
2. Frontend calls `/api/auth/send-otp`
3. Backend generates 6-digit OTP, stores in DB
4. OTP sent via SMS (or shown in dev mode)
5. User enters OTP
6. Frontend calls `/api/auth/verify-otp`
7. Backend verifies OTP, creates/fetches user
8. JWT tokens generated with user claims
9. Tokens returned to frontend
10. Frontend stores tokens and updates Redux
11. User redirected based on profile status:
    - New user → Registration page
    - Pending approval → Pending page
    - Approved → Dashboard

### Registration Flow
1. User fills multi-step registration form:
   - Step 1: Basic Info (company, owner, contact)
   - Step 2: Business Details (GST, PAN, address)
   - Step 3: Document Upload (certificates)
2. Frontend calls `/api/auth/register` with FormData
3. Backend validates data
4. Documents uploaded to AWS S3
5. User and Manufacturer records created
6. Status set to "pending"
7. Admin notification sent
8. User redirected to pending approval page

### Protected Route Access
1. User makes authenticated request
2. Axios interceptor adds `Authorization: Bearer {token}`
3. Backend middleware verifies token
4. Claims extracted and validated
5. Role checked if required
6. Request proceeds with user context

### Token Refresh Flow
1. Access token expires (401 response)
2. Axios interceptor catches error
3. Refresh token sent to `/api/auth/refresh`
4. New access token generated
5. Original request retried with new token
6. If refresh fails → Redirect to login

## Security Features

- ✅ OTP expiry (5 minutes)
- ✅ OTP one-time use (marked as verified)
- ✅ JWT signature verification
- ✅ Token expiry enforcement
- ✅ Role-based access control
- ✅ Automatic token cleanup
- ✅ Secure file upload validation
- ✅ HTTPS recommended in production

## Environment Variables

```env
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
```

## Database Setup

```bash
# Initialize database tables
# Tables will be auto-created on first API call via sequelize.sync()

# Or manually run migrations if you prefer
```

## Testing

### Development Mode
- OTP is returned in API response (for testing)
- Console logs show generated OTP
- Token expiry can be adjusted for testing

### Production Mode
- OTP sent via SMS gateway (Twilio/MSG91)
- OTP not returned in response
- Standard token expiry applied

## Common Issues & Solutions

### Issue: "redux-persist failed to create sync storage"
**Solution:** This warning occurs in SSR. It's harmless - persistence works on client side.

### Issue: Token expired
**Solution:** Token will auto-refresh. Ensure refresh token is valid.

### Issue: OTP not received
**Solution:** 
- Check SMS gateway configuration
- Verify mobile number format (+91XXXXXXXXXX)
- Check OTP in console (dev mode)

### Issue: File upload fails
**Solution:**
- Check file size (max 5MB)
- Verify AWS S3 credentials
- Ensure correct content-type header

## Next Steps

- [ ] Implement SMS gateway (Twilio/MSG91)
- [ ] Add email notifications
- [ ] Implement admin approval workflow
- [ ] Add password-based login option
- [ ] Implement 2FA
- [ ] Add social login
- [ ] Rate limiting for OTP requests
- [ ] Device tracking
- [ ] Session management

## Support

For issues or questions:
- Email: support@skaarvi.com
- Documentation: [Your docs URL]

# Quick Start - Test Authentication

## Testing the Complete Authentication Flow

### 1. Start the Application
```bash
cd skaarvi-reseller
npm run dev
```
Visit: http://localhost:3000

### 2. Test Login Flow

#### Step 1: Send OTP
1. Go to http://localhost:3000/login
2. Enter mobile number: `9876543210` (without +91)
3. Click "Send OTP"
4. **In development mode**, check the browser console or toast notification for the OTP
5. The OTP will be a 6-digit number like `123456`

#### Step 2: Verify OTP
1. Enter the OTP shown in console/toast
2. Click "Verify & Login"
3. Since you're a new user, you'll be redirected to the registration page

### 3. Test Registration Flow

#### Step 1: Basic Information
- Company Name: `ABC Manufacturing`
- Owner Name: `John Doe`
- Mobile: (pre-filled from login)
- Email: `john@abc.com`

Click "Next"

#### Step 2: Business Details
- Business Type: `Private Limited`
- GST Number: `22AAAAA0000A1Z5`
- PAN Number: `ABCDE1234F`
- Address: `123 Business Park`
- City: `Mumbai`
- State: `Maharashtra`
- Pincode: `400001`

Click "Next"

#### Step 3: Upload Documents
- GST Certificate: Upload any PDF/Image
- PAN Card: Upload any PDF/Image
- Address Proof: Upload any PDF/Image

Click "Submit Registration"

You'll be redirected to the "Pending Approval" page.

### 4. Test Login with Registered Account

#### Simulate Admin Approval (Database)
To test approved login, you need to manually update the database:

```sql
-- Update manufacturer status to approved
UPDATE manufacturers 
SET status = 'approved' 
WHERE gst_number = '22AAAAA0000A1Z5';

-- Activate user
UPDATE users 
SET is_active = true 
WHERE mobile = '+919876543210';
```

#### Login Again
1. Go to http://localhost:3000/login
2. Enter the same mobile number
3. Get new OTP
4. Verify OTP
5. You'll be redirected to the Dashboard!

### 5. Test Protected Routes

#### Access Dashboard
- URL: http://localhost:3000/manufacturer/dashboard
- Requires: Valid JWT token
- Shows: Stats cards, orders, analytics

#### Test API Directly

**Get Dashboard Data:**
```bash
curl -X GET http://localhost:3000/api/manufacturers/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get User Profile:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Test Token Refresh

#### Manually Expire Token
1. Open browser DevTools → Application → Local Storage
2. Copy your `token` value
3. Go to https://jwt.io and paste it
4. Change the `exp` (expiry) to a past timestamp
5. Copy the modified token back to localStorage
6. Make an API request - it should auto-refresh!

### 7. Test Different User Flows

#### New User (No Registration)
- Login with new mobile
- Gets redirected to `/register`

#### Registered but Pending
- Login with registered mobile (status = pending)
- Gets redirected to `/pending-approval`

#### Approved Manufacturer
- Login with approved account
- Gets redirected to `/manufacturer/dashboard`

#### Rejected/Suspended
- Login shows status message
- Access restricted

## API Testing with Postman/Insomnia

### Collection Setup

#### 1. Send OTP
```
POST http://localhost:3000/api/auth/send-otp
Content-Type: application/json

{
  "mobile": "+919876543210"
}
```

#### 2. Verify OTP
```
POST http://localhost:3000/api/auth/verify-otp
Content-Type: application/json

{
  "mobile": "+919876543210",
  "otp": "123456"
}
```

**Save the token from response for next requests!**

#### 3. Register Manufacturer
```
POST http://localhost:3000/api/auth/register
Content-Type: multipart/form-data

mobile: +919876543210
email: john@abc.com
companyName: ABC Manufacturing
ownerName: John Doe
businessType: pvt_ltd
gstNumber: 22AAAAA0000A1Z5
panNumber: ABCDE1234F
address: 123 Business Park
city: Mumbai
state: Maharashtra
pincode: 400001
gstCertificate: [file]
panCard: [file]
addressProof: [file]
```

#### 4. Get Profile (Protected)
```
GET http://localhost:3000/api/auth/me
Authorization: Bearer {your_token}
```

#### 5. Get Dashboard (Protected)
```
GET http://localhost:3000/api/manufacturers/dashboard
Authorization: Bearer {your_token}
```

#### 6. Refresh Token
```
POST http://localhost:3000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{your_refresh_token}"
}
```

## Development Tips

### View OTP in Console
When you send OTP, check the browser console:
```
OTP for +919876543210: 123456
```

Or check the toast notification (top-right).

### View Generated Tokens
After login, open DevTools → Application → Local Storage:
- `token` - Access token (expires in 7 days)
- `refreshToken` - Refresh token (expires in 30 days)

### Decode JWT Token
Go to https://jwt.io and paste your token to see the claims:
```json
{
  "userId": "uuid",
  "mobile": "+919876543210",
  "email": "john@abc.com",
  "role": "manufacturer",
  "isVerified": true,
  "iat": 1234567890,
  "exp": 1234667890
}
```

### Check Redux State
Install Redux DevTools extension to inspect:
- `auth.user` - Current user data
- `auth.token` - Current token
- `auth.isAuthenticated` - Login status

## Troubleshooting

### OTP Not Showing
- Check browser console
- Check toast notifications (top-right)
- OTP is logged server-side: check terminal

### Database Connection Error
```bash
# Ensure PostgreSQL is running
# Check .env.local credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skaarvi_resell_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### File Upload Fails
- Check file size (max 5MB)
- Verify file types (PDF, JPG, PNG)
- AWS credentials not required in dev (files will fail upload but registration will work)

### Token Issues
- Clear localStorage and login again
- Check token expiry in jwt.io
- Ensure JWT_SECRET is set in .env.local

### Redux Persist Warning
```
redux-persist failed to create sync storage
```
This is normal in Next.js SSR. Persistence works on client side.

## Next Steps

After testing authentication:
1. ✅ Test product management
2. ✅ Test order fulfillment
3. ✅ Test inventory management
4. ✅ Test earnings tracking
5. ✅ Test analytics dashboard

## Production Checklist

Before deploying:
- [ ] Change JWT_SECRET to strong random string
- [ ] Configure SMS gateway (Twilio/MSG91)
- [ ] Remove OTP from API response
- [ ] Set up AWS S3 for file storage
- [ ] Configure PostgreSQL database
- [ ] Enable HTTPS
- [ ] Set up rate limiting
- [ ] Configure CORS
- [ ] Add monitoring and logging
- [ ] Set up email notifications
- [ ] Configure admin approval workflow

## Support

Questions? Check:
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Complete auth documentation
- [README.md](./README.md) - Project overview
- GitHub Issues - Report bugs
- Email: support@skaarvi.com

# SKAARVI RESELL MARKETPLACE - DETAILED REQUIREMENTS

## 📋 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [User Types & Roles](#user-types--roles)
3. [Functional Requirements](#functional-requirements)
4. [Business Logic & Calculations](#business-logic--calculations)
5. [Technical Requirements](#technical-requirements)
6. [Security Requirements](#security-requirements)
7. [Integration Requirements](#integration-requirements)
8. [Performance Requirements](#performance-requirements)

---

## 📌 PROJECT OVERVIEW

### Project Name
**Skaarvi Resell Marketplace**

### Project Vision
Build a marketplace platform where manufacturers can list products and resellers can promote and sell those products using unique referral links. The platform should work similar to Amazon Affiliate + Meesho Reselling Model.

### Platform URL
`resell.skaarvi.com`

### Technology Stack
- **Frontend:** React / Next.js with Redux + JWT Authentication
- **Backend:** Node.js with Express
- **Database:** PostgreSQL
- **Storage:** AWS S3
- **Payment Gateway:** Razorpay
- **Authentication:** OTP Login (JWT Based)
- **Hosting:** AWS
- **State Management:** Redux Toolkit
- **Cache:** Redis (for OTP and token blacklist)

---

## 👥 USER TYPES & ROLES

### 1. Super Admin (Skaarvi)

**Permissions:**
- ✅ Full system access
- ✅ Manage all users (manufacturers, resellers, customers)
- ✅ Approve/reject products
- ✅ Set commission rates
- ✅ Manage orders and refunds
- ✅ Process payouts
- ✅ View all reports and analytics
- ✅ Manage platform settings
- ✅ Manage banners and promotions
- ✅ Manage referral commissions

**Dashboard Features:**
- Overview metrics (revenue, orders, users)
- Real-time order tracking
- Pending approvals (manufacturers, products, withdrawals)
- Revenue breakdown (platform fees, margins)
- User management interface
- Reports and analytics

### 2. Manufacturer

**Registration Fields:**
- Company Name (required)
- Contact Person Name (required)
- Mobile Number (required, unique)
- Email Address (required, unique)
- GST Number (required, validated)
- Complete Address (required)
- Bank Account Details (Account Number, IFSC, Account Holder Name)
- UPI ID (optional)
- Company Logo (optional)

**Dashboard Features:**
- Add/Edit/Delete Products
- Bulk product upload (CSV)
- Update stock quantities
- Upload product images (unlimited)
- Upload product videos (unlimited)
- Upload product catalog PDF
- View orders (all, pending, completed, cancelled)
- View earnings breakdown
- View product performance analytics
- Track inventory levels
- Download sales reports

**Product Management:**
- Product Name
- Product Description (rich text editor)
- Category Selection
- Product Images (multiple, drag-to-reorder)
- Product Videos (multiple)
- Product Cost Price
- Stock Quantity
- SKU (auto-generated or manual)
- Product Specifications (key-value pairs)
- Shipping Information
- Delivery Time Estimate
- Product Tags
- Status (Draft, Pending Approval, Active, Inactive)

**Approval Workflow:**
- Product submitted → Status: Pending Approval
- Admin reviews → Approve or Reject with reason
- If approved → Status: Active
- If rejected → Manufacturer can edit and resubmit

### 3. Reseller

**Registration Fields:**
- Full Name (required)
- Mobile Number (required, unique)
- Email Address (required, unique)
- City (required)
- State (required)
- Pincode (required)
- Bank Account Details (optional initially)
- UPI ID (optional)
- Profile Photo (optional)
- Referral Code of Sponsor (optional)

**Reseller Types:**
1. **Free Reseller**
   - Standard commission rates
   - Basic support
   - Access to all public products

2. **Verified Skaarvi Reseller**
   - Higher commission rates (+5%)
   - Priority support
   - Exclusive products access
   - Featured badge

3. **Premium Reseller**
   - Highest commission rates (+10%)
   - Dedicated account manager
   - Early access to new products
   - Marketing materials
   - Premium badge

**Dashboard Features:**
- Browse all approved products
- Advanced search and filters
- Generate unique product links (with tracking)
- Download product images (bulk download)
- Download product videos (bulk download)
- Download product catalog PDF
- View earnings (total, pending, approved, withdrawn)
- View commission breakdown per order
- Track order status
- Wallet management
- Submit withdrawal requests
- View referral performance
- Share products directly to WhatsApp/Social Media
- View leaderboard ranking

**Product Page for Resellers:**
- Product images gallery
- Product videos
- Detailed product description
- Customer selling price
- Reseller profit per sale (highlighted)
- Available stock status
- Shipping details
- Delivery time
- Generate unique link button
- Download all media button
- Share to WhatsApp button
- Copy link button

### 4. Customer

**Customer Journey:**
- Browse products (public access)
- View product details
- Add products to cart
- Checkout (creates account if first time)
- Pay online via Razorpay
- Track orders
- View order history
- Request returns/refunds

**Customer Registration (Minimal):**
- Name
- Mobile Number (OTP verification)
- Email
- Delivery Address

**Important:** Commission details and reseller information are completely hidden from customers.

---

## ⚙️ FUNCTIONAL REQUIREMENTS

### FR-1: Authentication & Authorization

**FR-1.1: OTP-Based Login**
- User enters mobile number
- System sends 6-digit OTP via SMS
- OTP valid for 5 minutes
- Maximum 3 OTP requests per 15 minutes (rate limiting)
- JWT token issued on successful verification
- Access token (1 hour expiry) + Refresh token (7 days expiry)
- Role-based access control

**FR-1.2: Registration**
- Separate registration flows for each user type
- Email and mobile number must be unique
- GST validation for manufacturers
- Document upload and verification
- Admin approval for manufacturers
- Auto-approval for resellers and customers

**FR-1.3: Session Management**
- JWT token stored in Redux + localStorage
- Auto-refresh expired tokens
- Logout revokes all tokens
- Multi-device login support

### FR-2: Product Management

**FR-2.1: Category Management (Admin)**
- Create categories and subcategories
- Edit category details
- Delete categories (with product reassignment)
- Set category commissions (optional override)

**FR-2.2: Product CRUD (Manufacturer)**
- Create product with all details
- Upload multiple images (max 10, optimized)
- Upload videos (max 3, S3 storage)
- Edit product details (requires re-approval if major changes)
- Delete products (soft delete)
- Bulk upload via CSV template
- Duplicate product feature

**FR-2.3: Product Approval (Admin)**
- View pending products list
- Review product details
- Approve with automatic status change
- Reject with reason
- Request modifications

**FR-2.4: Stock Management**
- Real-time stock updates
- Low stock alerts (< 10 units)
- Out of stock auto-hide
- Stock history tracking

### FR-3: Referral & Link System

**FR-3.1: Unique Reseller Links**
- Each reseller gets unique code (e.g., SKR1001, SKR1002)
- Product link format: `resell.skaarvi.com/product/{productId}?ref={resellerCode}`
- Link click tracking
- Cookie-based attribution (30-day window)
- Last-click attribution model

**FR-3.2: Referral Tracking**
- Track which reseller shared the link
- Store referral click data
- Associate orders with correct reseller
- Handle multi-device tracking via cookies

**FR-3.3: Customer-to-Reseller Conversion**
- When customer registers as reseller, check for previous referral
- Auto-assign sponsor based on purchase history
- Notify original reseller of new downline
- Future MLM rewards capability

### FR-4: Order Management

**FR-4.1: Order Creation**
- Customer adds products to cart
- Checkout with delivery address
- Order total calculation (price + shipping)
- Payment via Razorpay
- Order confirmation email/SMS

**FR-4.2: Order Processing**
- Order statuses: New → Processing → Shipped → Delivered
- Admin can change order status
- Manufacturer receives order notification
- Reseller receives commission notification

**FR-4.3: Order Tracking**
- Unique order ID generation
- Real-time status updates
- SMS/Email notifications on status change
- Estimated delivery date

**FR-4.4: Returns & Refunds**
- Customer can request return (7-day window)
- Admin approves/rejects return
- Refund processing
- Commission reversal on return

### FR-5: Commission & Pricing System

**FR-5.1: Price Calculation**
```
Manufacturer Cost Price: ₹1,000
+ Reseller Margin: ₹200
+ Skaarvi Margin: ₹100
= Customer Selling Price: ₹1,300

Distribution on Sale:
- Platform Fee (5% of ₹1,000): ₹50
- Skaarvi Margin: ₹100
- Total to Skaarvi: ₹150
- Reseller Commission: ₹200
- To Manufacturer: ₹950
```

**FR-5.2: Commission Configuration**
- Admin sets default reseller margin (percentage or fixed)
- Admin sets Skaarvi margin
- Product-specific commission override
- Category-specific commission override
- Reseller-type specific commission rates

**FR-5.3: Platform Fee**
- 5% of manufacturer's cost price
- Deducted automatically on order
- Visible in manufacturer reports

### FR-6: Wallet System

**FR-6.1: Wallet Operations**
- Credit on order delivery
- Debit on withdrawal
- Transaction history with filters
- Current balance display
- Pending balance (orders in transit)

**FR-6.2: Wallet Categories**
- Total Earnings (lifetime)
- Pending Earnings (orders not delivered)
- Available Balance (ready to withdraw)
- Withdrawn Amount (history)

**FR-6.3: Minimum Withdrawal**
- Minimum threshold: ₹500
- Maximum per request: ₹50,000
- Processing time: 3-5 business days

### FR-7: Withdrawal System

**FR-7.1: Withdrawal Request**
- Reseller submits request with amount
- Bank details verification
- Admin receives notification

**FR-7.2: Withdrawal Processing**
- Admin reviews request
- Approve/Reject with reason
- If approved → Status: Paid
- Payment via bank transfer or UPI
- Transaction receipt generation

**FR-7.3: Withdrawal History**
- List all requests with status
- Filter by date, status
- Download statement

### FR-8: Media Management

**FR-8.1: Media Upload (Manufacturer)**
- Image upload with drag-drop
- Video upload to S3
- Automatic thumbnail generation
- Image optimization (WebP conversion)
- Bulk media upload

**FR-8.2: Media Download (Reseller)**
- Download single image
- Bulk download all product images (ZIP)
- Download videos
- Watermark option (with reseller code)

**FR-8.3: Catalog Generation**
- Auto-generate product catalog PDF
- Include product details, images, prices
- Reseller-specific catalog with their code

### FR-9: Search & Filtering

**FR-9.1: Search Functionality**
- Full-text search on product name, description
- Search by manufacturer
- Search by category
- Auto-suggest/autocomplete

**FR-9.2: Filters**
- Price range (min-max)
- Category filter
- Profit margin range (for resellers)
- Stock availability
- Sort by: Newest, Price (low-high), Price (high-low), Profit

**FR-9.3: Advanced Filters**
- Best sellers (most ordered)
- Trending products (most clicked)
- New arrivals (last 30 days)
- Top earning products

### FR-10: Leaderboard System

**FR-10.1: Leaderboard Categories**
- Top sellers by total sales
- Top earners by commission
- Most referrals made
- Most active resellers

**FR-10.2: Leaderboard Display**
- Monthly leaderboard
- All-time leaderboard
- Category-wise leaderboard
- Rewards for top performers

### FR-11: Notifications

**FR-11.1: Notification Channels**
- WhatsApp notifications
- Email notifications
- SMS notifications
- In-app notifications

**FR-11.2: Notification Events**
- Order received (manufacturer, reseller)
- Product sold (manufacturer)
- Commission credited (reseller)
- Withdrawal approved (reseller)
- Product approval/rejection (manufacturer)
- Low stock alert (manufacturer)
- New product available (reseller)
- Payment reminder (customer)

**FR-11.3: Notification Preferences**
- Users can enable/disable channels
- Frequency settings
- Do not disturb hours

### FR-12: Reporting & Analytics

**FR-12.1: Admin Reports**
- Dashboard overview (revenue, orders, users)
- Revenue breakdown by source
- Monthly growth charts
- Top manufacturers by revenue
- Top resellers by sales
- Product performance
- Category performance
- Geographic distribution
- Export reports (PDF, Excel)

**FR-12.2: Manufacturer Reports**
- Total sales by product
- Earnings breakdown
- Inventory status
- Order fulfillment rate
- Product views vs sales conversion
- Revenue trends

**FR-12.3: Reseller Reports**
- Total sales and commissions
- Top selling products
- Referral click statistics
- Conversion rate
- Earnings trends
- Downline performance (if MLM active)

---

## 💰 BUSINESS LOGIC & CALCULATIONS

### Revenue Model 1: Platform Fee
```
Platform Fee = 5% of Manufacturer Cost Price
When product is sold:
- Manufacturer pays 5% fee to Skaarvi
- Example: Product Cost = ₹1,000 → Platform Fee = ₹50
```

### Revenue Model 2: Profit Sharing
```
Customer Price = Manufacturer Cost + Reseller Margin + Skaarvi Margin

Example:
- Manufacturer Cost: ₹1,000
- Reseller Margin: ₹200
- Skaarvi Margin: ₹100
- Customer Sees: ₹1,300

Distribution:
- To Manufacturer: ₹1,000 - ₹50 (fee) = ₹950
- To Reseller: ₹200
- To Skaarvi: ₹50 (fee) + ₹100 (margin) = ₹150
```

### Commission Calculation Formula
```javascript
// Base calculation
const customerPrice = manufacturerCost + resellerMargin + skaarviMargin;
const platformFee = manufacturerCost * 0.05;

// On order completion
const manufacturerAmount = manufacturerCost - platformFee;
const resellerAmount = resellerMargin;
const skaarviAmount = platformFee + skaarviMargin;

// Reseller type bonus
if (resellerType === 'verified') {
  resellerAmount *= 1.05; // +5%
} else if (resellerType === 'premium') {
  resellerAmount *= 1.10; // +10%
}
```

### Referral Attribution Logic
```javascript
// When customer makes purchase
1. Check for referral cookie (ref parameter)
2. If found, attribute order to that reseller
3. Store attribution in order record
4. On delivery, credit commission to reseller wallet

// When customer becomes reseller
1. Check purchase history for referral data
2. If referral exists, set as sponsor
3. Create sponsor-downline relationship
4. Enable future MLM rewards
```

---

## 🔒 SECURITY REQUIREMENTS

### SEC-1: Authentication Security
- JWT tokens with short expiry (1 hour access, 7 days refresh)
- Token rotation on refresh
- Token blacklisting on logout
- Bcrypt password hashing (if passwords used)
- OTP rate limiting (max 3 per 15 min)
- Account lockout after 5 failed attempts

### SEC-2: Data Security
- Encrypt sensitive data at rest (bank details, PII)
- HTTPS enforced (TLS 1.3)
- Redux Persist encryption
- SQL injection prevention (parameterized queries)
- XSS protection (input sanitization)
- CSRF protection

### SEC-3: Payment Security
- PCI DSS compliance via Razorpay
- No storage of card details
- Payment webhooks signature verification
- Idempotency for payment requests

### SEC-4: Access Control
- Role-based access control (RBAC)
- Row-level security for data access
- API rate limiting (100 req/min per user)
- IP-based blocking for suspicious activity

### SEC-5: File Upload Security
- File type validation (images, videos, PDFs only)
- File size limits (images: 5MB, videos: 50MB)
- Virus scanning
- Secure S3 bucket with signed URLs

---

## 🔌 INTEGRATION REQUIREMENTS

### INT-1: Payment Gateway (Razorpay)
- Payment link generation
- Payment capture
- Refund processing
- Webhook handling for payment status
- Settlement reports

### INT-2: SMS Gateway (MSG91/Twilio)
- OTP sending
- Order notifications
- Promotional messages
- Delivery updates

### INT-3: Email Service (SendGrid/AWS SES)
- Transactional emails
- Order confirmations
- Welcome emails
- Reports delivery

### INT-4: WhatsApp Business API
- Order notifications
- Commission updates
- Product sharing
- Customer support

### INT-5: AWS S3
- Media storage (images, videos)
- CDN integration (CloudFront)
- Backup storage
- Report storage

### INT-6: Redis
- OTP storage (5-minute TTL)
- Session management
- Token blacklist
- Cache frequently accessed data

---

## ⚡ PERFORMANCE REQUIREMENTS

### PERF-1: Response Times
- API response time: < 200ms (p95)
- Page load time: < 2 seconds
- Image loading: Progressive/lazy loading
- Database queries: < 100ms

### PERF-2: Scalability
- Support 10,000+ concurrent users
- Handle 1,000+ orders per day
- Store 100,000+ products
- Process 10,000+ media files

### PERF-3: Optimization
- Database indexing on frequently queried fields
- Redis caching for hot data
- CDN for static assets
- Image optimization (WebP, compression)
- API pagination (max 50 records per request)
- Lazy loading for product lists

### PERF-4: Monitoring
- Application performance monitoring (APM)
- Error tracking (Sentry)
- Database query monitoring
- Server resource monitoring
- Uptime monitoring (99.9% SLA)

---

## 🚀 FUTURE ENHANCEMENTS (PHASE 2)

1. **Mobile Applications**
   - Android app (React Native)
   - iOS app (React Native)
   - Push notifications

2. **AI Features**
   - AI-powered product description generator
   - AI image enhancement
   - Chatbot for customer support
   - Demand forecasting

3. **Social Features**
   - One-click WhatsApp share
   - Social media integrations
   - Reseller community forum
   - Live chat support

4. **MLM Features**
   - Multi-level referral rewards
   - Team building bonuses
   - Rank achievement system
   - Leadership rewards

5. **Advanced Features**
   - Multi-language support (Hindi, Tamil, Telugu, etc.)
   - Multi-currency support
   - Subscription plans for manufacturers
   - Premium reseller programs
   - Dropshipping automation
   - Inventory forecasting
   - Dynamic pricing engine

---

## 📝 IMPORTANT NOTES

1. **Customer Privacy**: No commission or reseller information should be visible to customers
2. **Transparent Pricing**: Resellers must clearly see their profit per product
3. **Fair Commission**: Commission rates should be sustainable for all parties
4. **Quality Control**: Admin approval ensures quality products on platform
5. **Scalability**: Architecture must support growth to 100,000+ users
6. **Mobile-First**: Design must be responsive and mobile-optimized
7. **Performance**: Fast loading times are critical for conversions
8. **Trust & Safety**: Robust fraud detection and prevention mechanisms

---

**Document Version:** 1.0  
**Last Updated:** June 7, 2026  
**Status:** Approved for Implementation

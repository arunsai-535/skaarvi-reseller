# Skaarvi Manufacturer Panel

Full-stack Next.js 14 application with App Router, Tailwind CSS, and Redux for the Skaarvi Resell Marketplace manufacturer panel.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion

### Backend (Next.js API Routes)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3
- **Email**: Nodemailer / SendGrid
- **SMS**: Twilio / MSG91
- **WhatsApp**: WhatsApp Business API

## 📁 Project Structure

```
skaarvi-reseller/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── manufacturers/        # Manufacturer endpoints
│   │   ├── products/             # Product endpoints
│   │   ├── orders/               # Order endpoints
│   │   ├── analytics/            # Analytics endpoints
│   │   └── earnings/             # Earnings endpoints
│   ├── (auth)/                   # Auth pages group
│   │   ├── login/
│   │   └── register/
│   ├── manufacturer/             # Protected manufacturer pages
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── earnings/
│   │   └── settlements/
│   ├── layout.js                 # Root layout
│   ├── providers.js              # Redux & other providers
│   ├── globals.css               # Global styles
│   └── page.js                   # Root page (redirects)
├── components/                   # React components
│   ├── layout/                   # Layout components
│   ├── manufacturer/             # Manufacturer-specific components
│   └── ui/                       # Reusable UI components
├── store/                        # Redux store
│   ├── slices/                   # Redux slices
│   └── index.js                  # Store configuration
├── lib/                          # Utility libraries
│   ├── database.js               # Database connection
│   ├── aws.js                    # AWS S3 configuration
│   ├── jwt.js                    # JWT utilities
│   ├── constants.js              # App constants
│   └── utils.js                  # Helper functions
├── hooks/                        # Custom React hooks
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json                  # Dependencies
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd skaarvi-reseller
npm install
```

### 2. Environment Configuration

Copy `.env.local.example` to `.env.local` and configure your variables:

```bash
cp .env.local.example .env.local
```

Update the following in `.env.local`:
- Database credentials (PostgreSQL)
- JWT secret key
- AWS S3 credentials
- Email/SMS/WhatsApp API keys
- Razorpay credentials

### 3. Database Setup

Ensure PostgreSQL is running and create the database:

```bash
createdb skaarvi_resell_db
```

Run the database schema:

```bash
psql -U postgres -d skaarvi_resell_db -f ../DATABASE-SCHEMA.sql
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 🎨 Design Features

### Modern UI with Tailwind CSS
- ✨ Gradient backgrounds
- 🎯 Smooth animations with Framer Motion
- 📱 Fully responsive design
- 🌙 Card-based layouts with hover effects
- 🎨 Custom color palette (Primary, Success, Warning, Danger)
- 📊 Interactive charts and visualizations

### Key Components
- **Dashboard Cards**: Animated summary cards with icons
- **Data Tables**: Sortable, filterable tables with pagination
- **Forms**: Multi-step forms with validation
- **File Upload**: Drag-and-drop with preview
- **Charts**: Line, bar, and pie charts for analytics
- **Notifications**: Toast notifications and notification center
- **Status Badges**: Color-coded status indicators
- **Loading States**: Skeletons and spinners

## 📡 API Routes

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/logout` - Logout user

### Manufacturers
- `GET /api/manufacturers/dashboard` - Get dashboard data
- `GET /api/manufacturers/profile` - Get profile
- `PUT /api/manufacturers/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/[id]` - Get order details
- `PATCH /api/orders/[id]/status` - Update order status

### Analytics
- `GET /api/analytics/products/[id]/demand` - Get reseller demand analytics
- `GET /api/analytics/sales` - Get sales analytics

## 🔐 Authentication Flow

### JWT-Based Authentication
1. User enters mobile number
2. OTP is sent via SMS
3. User verifies OTP
4. JWT tokens are generated with claims (userId, role, email, etc.)
5. Tokens stored in Redux (persisted to localStorage)
6. Automatic token refresh on expiry

### JWT Claims
- `userId` - User UUID
- `mobile` - Phone number
- `email` - Email address
- `role` - User role (manufacturer/reseller/customer)
- `isVerified` - Account verification status

**See [AUTHENTICATION.md](./AUTHENTICATION.md) for complete documentation.**

## 🎯 Key Features

### Reseller Demand Analytics (Unique)
- Track how many resellers saved a product
- Monitor product shares
- Analyze link clicks
- Calculate conversion rates
- Identify trending products

### Dashboard
- Total products, orders, sales overview
- Earnings breakdown
- Pending settlements
- Real-time metrics

### Product Management
- Add/edit products with rich media
- Multiple image upload
- Video and catalog support
- Inventory management
- Stock alerts

### Order Management
- View and filter orders
- Update order status
- Add tracking information
- Order timeline visualization

### Earnings & Settlements
- Revenue breakdown
- Platform fee calculation
- Settlement history
- Downloadable reports

## 🚦 Development Workflow

### Code Structure
- Use functional components with hooks
- Keep components small and focused
- Use Redux for global state
- Use React Query for server state (optional)
- Follow naming conventions

### Styling
- Use Tailwind utility classes
- Create reusable component classes in `globals.css`
- Follow mobile-first approach
- Use `cn()` utility for conditional classes

### API Development
- Create route handlers in `app/api/`
- Use NextResponse for responses
- Implement proper error handling
- Add authentication middleware

## 📝 TODO

- [ ] Implement authentication middleware for API routes
- [ ] Connect database models
- [ ] Add file upload functionality
- [ ] Implement email/SMS services
- [ ] Create UI components library
- [ ] Add form validation
- [ ] Build dashboard pages
- [ ] Implement product management
- [ ] Add order management features
- [ ] Create analytics charts
- [ ] Add notifications system
- [ ] Implement settlements

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📄 License

MIT

## 👥 Contributors

Skaarvi Team

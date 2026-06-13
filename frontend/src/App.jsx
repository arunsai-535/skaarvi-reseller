import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Manufacturer Pages
import Dashboard from '@/pages/manufacturer/Dashboard';
import Products from '@/pages/manufacturer/products/Products';
import AddProduct from '@/pages/manufacturer/products/AddProduct';
import EditProduct from '@/pages/manufacturer/products/EditProduct';
import ProductAnalytics from '@/pages/manufacturer/products/ProductAnalytics';
import Orders from '@/pages/manufacturer/orders/Orders';
import OrderDetails from '@/pages/manufacturer/orders/OrderDetails';
import Inventory from '@/pages/manufacturer/Inventory';
import Earnings from '@/pages/manufacturer/Earnings';
import Settlements from '@/pages/manufacturer/Settlements';
import Reports from '@/pages/manufacturer/Reports';
import Profile from '@/pages/manufacturer/Profile';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'manufacturer') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/manufacturer/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* Protected Manufacturer Routes */}
      <Route
        path="/manufacturer"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="products/analytics/:id" element={<ProductAnalytics />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="settlements" element={<Settlements />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Redirect root to login or dashboard */}
      <Route path="/" element={<Navigate to="/manufacturer/dashboard" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

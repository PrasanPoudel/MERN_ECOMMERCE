import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { getProfile } from "./store/slices/authSlice";
import { fetchCart } from "./store/slices/cartSlice";

import Navbar from "./components/common/Navbar";
import {
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
} from "./components/common/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCategories from "./pages/admin/AdminCategories";

// Layout wrapper that adds the Navbar above all public/customer pages
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) dispatch(getProfile());
  }, [token]);

  useEffect(() => {
    if (token && user?.role === "customer") dispatch(fetchCart());
  }, [token, user?.role]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Guard: If we already verified it's online, do nothing.
    if (!isLoading) return;

    let timerId;

    const checkServer = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/check-server`,
        );
        // console.log("Checking server status...");
        if (response?.ok) {
          console.log("Server is up and running!");
          sessionStorage.setItem("isServerOnline", "true");
          setIsLoading(false); //  Stops loading
        } else {
          // Server is technically there but returned an error (e.g., 500, 503)
          // Retry in 5 seconds
          setIsLoading(true); // Keep loading until we get a successful response
          console.log("Server responded with an error. Retrying...");
          timerId = setTimeout(checkServer, 5000);
        }
      } catch (err) {
        // Server is completely offline or network is down
        // Retry in 5 seconds
        console.log("Server is completely offline. Retrying in 5s...");
        timerId = setTimeout(checkServer, 5000);
      }
    };

    checkServer();

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timerId);
  }, [isLoading]);
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 p-4">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4">
          {/* Modern Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-zinc-200 border-t-zinc-950"></div>
          </div>

          {/* Status Messages */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
              Connecting to server...
            </h3>
            <p className="text-sm text-zinc-500 max-w-70">
              Please hold on while we connect to server. This might take a few
              moments.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#fafafa",
            borderRadius: "14px",
            fontSize: "12px",
            fontWeight: "500",
            padding: "12px 16px",
            boxShadow: "0 8px 24px -4px rgb(0 0 0 / 0.2)",
          },
          success: { iconTheme: { primary: "#4ade80", secondary: "#18181b" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#18181b" } },
        }}
      />
      <Routes>
        {/* Guest only (redirect to / if already logged in) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Admin routes (no Navbar) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
        </Route>

        {/* Public + customer routes (with Navbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected customer routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import FindTrucks from "./pages/FindTrucks";
import TruckDetails from "./pages/TruckDetails";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTruck from "./pages/CreateTruck";
import EditTruck from "./pages/EditTruck";
import LiveLocation from "./pages/LiveLocation";
import TruckLocationUpdate from "./pages/TruckLocationUpdate";
import NotFound from "./pages/NotFound";
import { Blog } from "./pages/Blog";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Sustainability from "./pages/Sustainability";
import OwnerSignup from "./pages/OwnerSignup";
import VendorLogin from "./pages/VendorLogin";
import VendorResources from "./pages/VendorResources";
import Pricing from "./pages/Pricing";
import SuccessStories from "./pages/SuccessStories";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Accessibility from "./pages/Accessibility";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component for Admin Access
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole: string }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/find-trucks" element={<FindTrucks />} />
            <Route path="/trucks/:id" element={<TruckDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<Events />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/owner-signup" element={<OwnerSignup />} />
            <Route path="/vendor-signup" element={<OwnerSignup />} />
            <Route path="/vendor-login" element={<VendorLogin />} />
            <Route path="/vendor-resources" element={<VendorResources />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/trucks/create" element={<CreateTruck />} />
            <Route path="/trucks/:id/edit" element={<EditTruck />} />
            <Route path="/trucks/:id/location" element={<LiveLocation />} />
            <Route path="/trucks/:truckId/update-location" element={<TruckLocationUpdate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

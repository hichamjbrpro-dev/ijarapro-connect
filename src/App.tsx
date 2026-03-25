import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import PropertiesPage from "@/pages/PropertiesPage";
import TenantsPage from "@/pages/TenantsPage";
import PaymentsPage from "@/pages/PaymentsPage";
import ContractsPage from "@/pages/ContractsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import LoginPage from "@/pages/auth/LoginPage";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/authStore";

const queryClient = new QueryClient();

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

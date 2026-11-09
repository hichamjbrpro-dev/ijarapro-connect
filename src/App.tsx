import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import TenantDetailPage from "@/pages/TenantDetailPage";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const AuthListener = ({ children }: { children: React.ReactNode }) => {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthListener>
          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/tenants/:id" element={<TenantDetailPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthListener>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

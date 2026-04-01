import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThreatAlertProvider } from "@/components/ThreatAlertProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import MessageAnalyzer from "@/pages/MessageAnalyzer";
import LinkScanner from "@/pages/LinkScanner";
import PhoneChecker from "@/pages/PhoneChecker";
import ThreatHistory from "@/pages/ThreatHistory";
import Reports from "@/pages/Reports";
import CommunityReports from "@/pages/CommunityReports";
import DataExplorer from "@/pages/DataExplorer";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThreatAlertProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analyzer" element={<MessageAnalyzer />} />
                <Route path="/link-scanner" element={<LinkScanner />} />
                <Route path="/phone-checker" element={<PhoneChecker />} />
                <Route path="/history" element={<ThreatHistory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/data" element={<DataExplorer />} />
                <Route path="/community" element={<CommunityReports />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThreatAlertProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

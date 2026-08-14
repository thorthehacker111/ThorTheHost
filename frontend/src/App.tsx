import { Route, Routes } from "react-router-dom";

import LandingPage from "@/pages/LandingPage";
import NotFoundPage from "@/pages/NotFoundPage";
import HowToUse from "@/pages/HowToUse";
import Asgard from "@/pages/Asgard";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import VerifyOtpPage from "@/pages/auth/VerifyOtpPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import AliasesPage from "@/pages/dashboard/AliasesPage";

/**
 * Top-level route table.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* How to use */}
      <Route path="/how-to-use" element={<HowToUse />} />

      {/* Asgard — Shout Out / featured hosters, admins, etc. */}
      <Route path="/asgard" element={<Asgard />} />

      {/* OTP verification — requires being logged in but NOT verified */}
      <Route element={<ProtectedRoute />}>
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="aliases" element={<AliasesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
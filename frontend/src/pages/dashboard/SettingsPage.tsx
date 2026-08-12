import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, AlertCircle, ShieldCheck, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [forwardEmail, setForwardEmail] = useState(user?.forward_email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const isVerified = user?.is_forward_verified ?? false;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload: any = {};
      if (forwardEmail !== user?.forward_email) payload.forward_email = forwardEmail;
      if (password) payload.password = password;

      if (Object.keys(payload).length === 0) {
        setMessage({ type: "success", text: "No changes to save." });
        setLoading(false);
        return;
      }

      await axios.patch("/api/v1/users/me", payload, { withCredentials: true });
      await checkAuth();
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setPassword("");
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.detail || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setSendingOtp(true);
    setMessage(null);
    try {
      await axios.post("/api/v1/auth/resend-otp", {}, { withCredentials: true });
      navigate("/verify-otp");
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.detail || "Failed to send OTP." });
      setSendingOtp(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-lightning">Settings</h1>
        <p className="mt-2 text-mist-bright">Manage your account preferences and security.</p>
      </div>

      {/* Verification Status Banner */}
      {!isVerified && (
        <div className="rounded-xl border border-lightning/30 bg-lightning/5 p-5 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-lightning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-lightning">Email Not Verified</h3>
            <p className="text-sm text-mist-bright mt-1">
              Your forwarding email <strong>{user?.forward_email}</strong> is not verified.
              Email forwarding is blocked until you verify it.
            </p>
          </div>
          <button
            onClick={handleSendVerification}
            disabled={sendingOtp}
            className="flex items-center gap-2 rounded-md bg-lightning px-4 py-2 text-sm font-bold text-void hover:bg-lightning-hot transition-colors disabled:opacity-60 flex-shrink-0"
          >
            <ShieldCheck className="h-4 w-4" />
            {sendingOtp ? "Sending..." : "Verify Now"}
          </button>
        </div>
      )}

      <div className="rounded-xl border border-steel bg-slate p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">Profile Settings</h2>

        {message && (
          <div className={`mb-6 p-4 rounded-md border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-success/10 border-success/30 text-success"
              : "bg-danger/10 border-danger/30 text-danger"
          }`}>
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-mist-bright mb-1">
              Username (Read-only)
            </label>
            <input
              type="text"
              value={user?.username || ""}
              disabled
              className="w-full rounded-md border border-steel bg-void px-4 py-2 text-mist cursor-not-allowed opacity-70"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-mist-bright mb-1">
              Forwarding Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={forwardEmail}
                onChange={(e) => setForwardEmail(e.target.value)}
                className="w-full rounded-md border border-steel bg-void-soft px-4 py-2 pr-32 text-foreground focus:border-lightning focus:outline-none focus:ring-1 focus:ring-lightning"
                required
              />
              {/* Verification badge inside input */}
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                isVerified
                  ? "bg-success/15 text-success"
                  : "bg-lightning/10 text-lightning"
              }`}>
                {isVerified
                  ? <><CheckCircle2 className="h-3 w-3" /> Verified</>
                  : <><AlertCircle className="h-3 w-3" /> Unverified</>
                }
              </span>
            </div>
            <p className="mt-2 text-xs text-mist">
              This is where all your alias emails will be forwarded.
              {!isVerified && (
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={sendingOtp}
                  className="ml-2 inline-flex items-center gap-1 text-lightning hover:underline disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" />
                  {sendingOtp ? "Sending OTP..." : "Send verification code"}
                </button>
              )}
            </p>
          </div>

          <div className="pt-4 border-t border-steel">
            <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
            <div>
              <label className="block text-sm font-medium text-mist-bright mb-1">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-steel bg-void-soft px-4 py-2 text-foreground focus:border-lightning focus:outline-none focus:ring-1 focus:ring-lightning"
                minLength={8}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-lightning px-6 py-2.5 font-bold text-void transition-colors hover:bg-lightning-hot disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

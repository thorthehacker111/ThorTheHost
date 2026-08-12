import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, RefreshCw } from "lucide-react";

export default function VerifyOtpPage() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already verified
  useEffect(() => {
    if (user?.is_forward_verified) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow single digit
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setError("");
    setVerifying(true);
    try {
      await axios.post("/api/v1/auth/verify-otp", { code }, { withCredentials: true });
      await checkAuth();
      setSuccess("Email verified! Redirecting to your dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      await axios.post("/api/v1/auth/resend-otp", {}, { withCredentials: true });
      setSuccess("A new code has been sent to your email.");
      setResendCooldown(60);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyLater = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void">
      <div className="w-full max-w-md rounded-xl bg-slate p-8 shadow-glow text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lightning/10 border border-lightning/30">
            <ShieldCheck className="h-8 w-8 text-lightning" />
          </div>
        </div>

        <h2 className="font-display text-3xl font-bold text-lightning mb-2">
          Verify Your Email
        </h2>
        <p className="text-mist-bright text-sm mb-1">
          We sent a 6-digit code to:
        </p>
        <p className="text-foreground font-medium mb-6">
          {user?.forward_email || "your forwarding email"}
        </p>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-14 w-12 rounded-lg border border-steel bg-void-soft text-center text-2xl font-bold text-foreground focus:border-lightning focus:outline-none focus:ring-2 focus:ring-lightning/50 transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-sm text-danger">{error}</p>
        )}
        {success && (
          <p className="mb-4 text-sm text-success">{success}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={verifying || digits.join("").length < 6}
          className="w-full rounded-md bg-lightning px-4 py-3 font-bold text-void transition-colors hover:bg-lightning-hot disabled:opacity-50 mb-3"
        >
          {verifying ? "Verifying..." : "Verify Email"}
        </button>

        <button
          onClick={handleResend}
          disabled={resending || resendCooldown > 0}
          className="flex items-center justify-center gap-2 w-full rounded-md border border-steel px-4 py-2.5 text-sm font-medium text-mist-bright hover:border-lightning hover:text-lightning transition-colors disabled:opacity-50 mb-4"
        >
          <RefreshCw className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
          {resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : resending
            ? "Sending..."
            : "Resend Code"}
        </button>

        <button
          onClick={handleVerifyLater}
          className="text-xs text-mist hover:text-mist-bright transition-colors underline underline-offset-2"
        >
          Verify later — go to dashboard
        </button>

        <p className="mt-6 text-xs text-mist">
          Code expires in 10 minutes. Email forwarding is blocked until verified.
        </p>
      </div>
    </div>
  );
}

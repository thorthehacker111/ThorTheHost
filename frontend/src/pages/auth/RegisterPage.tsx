import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [forwardEmail, setForwardEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Register — forward_email is used as both the account email and forwarding address
      await axios.post("/api/v1/auth/register", {
        username,
        forward_email: forwardEmail,
        password,
      });

      // Auto-login after registration
      const res = await axios.post(
        "/api/v1/auth/login",
        { login: username, password },
        { withCredentials: true }
      );
      await authLogin(res.data.access_token);

      // Redirect to OTP verification
      navigate("/verify-otp");
    } catch (err: any) {
      let errorMsg = "An error occurred";
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        errorMsg = detail;
      } else if (Array.isArray(detail)) {
        errorMsg = detail.map((d: any) => d.msg).join(", ");
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void py-12">
      <div className="w-full max-w-md rounded-xl bg-slate p-8 shadow-glow">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-lightning">
          Forge Your Path
        </h2>
        <p className="mb-6 text-center text-sm text-mist">
          Your forwarding email is where all alias emails will be delivered.
        </p>
        {error && <p className="mb-4 text-center text-danger">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mist-bright">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-steel bg-void-soft px-4 py-2 text-foreground focus:border-lightning focus:outline-none focus:ring-1 focus:ring-lightning"
              required
              minLength={3}
              placeholder="your_username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mist-bright">
              Forwarding Email
            </label>
            <input
              type="email"
              value={forwardEmail}
              onChange={(e) => setForwardEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-steel bg-void-soft px-4 py-2 text-foreground focus:border-lightning focus:outline-none focus:ring-1 focus:ring-lightning"
              required
              placeholder="you@gmail.com"
            />
            <p className="mt-1 text-xs text-mist">
              Alias emails will be forwarded here. A verification code will be sent to confirm.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-mist-bright">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-steel bg-void-soft px-4 py-2 text-foreground focus:border-lightning focus:outline-none focus:ring-1 focus:ring-lightning"
              required
              minLength={8}
              placeholder="Min. 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-md bg-lightning px-4 py-2 font-bold text-void transition-colors hover:bg-lightning-hot disabled:opacity-60"
          >
            {loading ? "Forging account..." : "Create Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-mist">
          Already a warrior?{" "}
          <Link to="/login" className="text-bifrost hover:underline">
            Enter Valhalla
          </Link>
        </p>
      </div>
    </div>
  );
}

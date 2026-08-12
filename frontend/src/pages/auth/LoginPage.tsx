import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "/api/v1/auth/login",
        { login, password },
        { withCredentials: true }
      );
      await authLogin(res.data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-void">
      <div className="w-full max-w-md rounded-xl bg-slate p-8 shadow-glow">
        <h2 className="mb-6 text-center font-display text-3xl font-bold text-lightning">
          Enter Valhalla
        </h2>
        {error && <p className="mb-4 text-center text-danger">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mist-bright">
              Email or Username
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="mt-1 w-full rounded-md border border-steel bg-void-soft px-4 py-2 text-foreground focus:border-lightning focus:outline-none focus:ring-1 focus:ring-lightning"
              required
            />
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
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-lightning px-4 py-2 font-bold text-void transition-colors hover:bg-lightning-hot"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-mist">
          New warrior?{" "}
          <Link to="/register" className="text-bifrost hover:underline">
            Forge an account
          </Link>
        </p>
      </div>
    </div>
  );
}

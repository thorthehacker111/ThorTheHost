import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Stats {
  total_aliases: number;
  active_aliases: number;
  emails_forwarded: number;
  emails_blocked: number;
}

export default function OverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/v1/users/stats", { withCredentials: true });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-lightning">Welcome back, {user?.username}</h1>
        <p className="mt-2 text-mist-bright">Manage your aliases and view your forwarding activity.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-flicker rounded-full bg-lightning opacity-50 shadow-glow"></div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat Cards */}
          <div className="rounded-xl border border-steel bg-slate p-6 shadow-glow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Mail size={48} className="text-lightning" />
             </div>
            <p className="text-sm font-medium text-mist-bright">Total Aliases</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats?.total_aliases}</p>
          </div>

          <div className="rounded-xl border border-steel bg-slate p-6 shadow-glow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={48} className="text-lightning" />
             </div>
            <p className="text-sm font-medium text-mist-bright">Active Aliases</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats?.active_aliases}</p>
          </div>

          <div className="rounded-xl border border-steel bg-slate p-6 shadow-glow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={48} className="text-lightning" />
             </div>
            <p className="text-sm font-medium text-mist-bright">Emails Forwarded</p>
            <p className="mt-2 text-3xl font-bold text-success">{stats?.emails_forwarded}</p>
          </div>

          <div className="rounded-xl border border-steel bg-slate p-6 shadow-glow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldAlert size={48} className="text-lightning" />
             </div>
            <p className="text-sm font-medium text-mist-bright">Emails Blocked</p>
            <p className="mt-2 text-3xl font-bold text-danger">{stats?.emails_blocked}</p>
          </div>
        </div>
      )}

      {/* Alias Forge CTA */}
      <div className="mt-8 rounded-xl border border-steel bg-slate p-8 text-center">
        <h2 className="text-xl font-bold text-foreground">Forge a New Alias</h2>
        <p className="mt-2 text-mist text-sm">Create a random alias to protect your real identity.</p>
        <Link 
           to="/dashboard/aliases"
           className="mt-6 inline-flex items-center gap-2 rounded-md bg-lightning px-6 py-2.5 font-bold text-void transition-colors hover:bg-lightning-hot"
        >
          <Zap className="h-4 w-4" />
          Forge Alias Now
        </Link>
      </div>
    </div>
  );
}

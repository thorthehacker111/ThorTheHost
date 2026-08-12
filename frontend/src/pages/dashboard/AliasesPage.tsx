import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Plus, Search, Trash2, Power, PowerOff } from "lucide-react";

const DOMAIN = "thorthehost.in";

interface Alias {
  id: number;
  alias: string;
  type: string;
  status: string;
  mail_count: number;
  created_at: string;
}

export default function AliasesPage() {
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [forging, setForging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const fetchAliases = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/aliases?search=${search}`, { withCredentials: true });
      setAliases(res.data);
    } catch (err: any) {
      setError("Failed to load aliases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAliases();
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleForge = async () => {
    setForging(true);
    setError(null);
    try {
      await axios.post("/api/v1/aliases", {}, { withCredentials: true });
      fetchAliases();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to forge alias.");
    } finally {
      setForging(false);
    }
  };

  const handleToggle = async (alias: Alias) => {
    const newStatus = alias.status === "active" ? "disabled" : "active";
    try {
      await axios.patch(`/api/v1/aliases/${alias.id}`, { status: newStatus }, { withCredentials: true });
      fetchAliases();
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleDelete = async (alias: Alias) => {
    if (!confirm(`Delete ${alias.alias}@${DOMAIN}? This cannot be undone.`)) return;
    try {
      await axios.delete(`/api/v1/aliases/${alias.id}`, { withCredentials: true });
      fetchAliases();
    } catch (err) {
      setError("Failed to delete alias");
    }
  };

  const copyToClipboard = (aliasName: string) => {
    const full = `${aliasName}@${DOMAIN}`;
    navigator.clipboard.writeText(full);
    setToast("Copied!");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="flex items-center gap-2 rounded-full bg-lightning px-5 py-2.5 text-sm font-bold text-void shadow-glow">
            <Copy size={14} />
            {toast}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-lightning">Your Aliases</h1>
          <p className="mt-2 text-mist-bright">Manage your {aliases.length}/500 email identities.</p>
        </div>
        <button
          onClick={handleForge}
          disabled={forging}
          className="inline-flex items-center gap-2 rounded-md bg-lightning px-4 py-2 font-bold text-void transition-colors hover:bg-lightning-hot disabled:opacity-50"
        >
          <Plus size={18} />
          {forging ? "Forging..." : "Forge Alias"}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-danger/10 border border-danger/30 text-danger">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 bg-void-soft border border-steel rounded-md px-3 py-2 w-full max-w-md focus-within:border-lightning">
        <Search className="text-mist" size={18} />
        <input
          type="text"
          placeholder="Search aliases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-foreground flex-1"
        />
      </div>

      <div className="rounded-xl border border-steel bg-slate overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-mist">Loading aliases...</div>
        ) : aliases.length === 0 ? (
          <div className="p-8 text-center text-mist">
            {search ? "No aliases found matching your search." : "You have not forged any aliases yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-void-soft text-mist-bright border-b border-steel">
                <tr>
                  <th className="px-6 py-4 font-medium">Alias</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Mails Forwarded</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel">
                {aliases.map((alias) => (
                  <tr key={alias.id} className="hover:bg-void-soft/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        <span>
                          <span className="text-foreground">{alias.alias}</span>
                          <span className="text-mist">@{DOMAIN}</span>
                        </span>
                        <button
                          onClick={() => copyToClipboard(alias.alias)}
                          className="text-mist hover:text-bifrost transition-colors flex-shrink-0"
                          title="Copy to clipboard"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        alias.status === "active" ? "bg-success/10 text-success" : "bg-mist/10 text-mist"
                      }`}>
                        {alias.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-mist-bright">
                      {alias.mail_count}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleToggle(alias)}
                        className={`transition-colors ${alias.status === "active" ? "text-mist hover:text-danger" : "text-mist hover:text-success"}`}
                        title={alias.status === "active" ? "Disable" : "Enable"}
                      >
                        {alias.status === "active" ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(alias)}
                        className="text-mist hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

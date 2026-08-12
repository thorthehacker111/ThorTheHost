import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Settings, Mail, LogOut, Menu, X } from "lucide-react";

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Aliases", path: "/dashboard/aliases", icon: Mail },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-void text-foreground">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r border-steel bg-void-soft md:flex">
        <div className="flex h-16 items-center px-6 border-b border-steel">
          <span className="font-display text-xl font-bold text-lightning shadow-glow-sm select-none">
            ThorTheHost
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-elevated text-lightning"
                    : "text-mist-bright hover:bg-slate hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-steel p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-slate"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-void/80" onClick={closeMobileMenu} />
          <div className="relative flex w-64 w-max-sm flex-col bg-void-soft border-r border-steel">
            <div className="flex h-16 items-center px-6 border-b border-steel justify-between">
               <span className="font-display text-xl font-bold text-lightning">
                  ThorTheHost
               </span>
               <button onClick={closeMobileMenu} className="text-mist-bright hover:text-lightning">
                 <X className="h-6 w-6" />
               </button>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-elevated text-lightning"
                        : "text-mist-bright hover:bg-slate hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-steel p-4">
              <button
                onClick={() => { closeMobileMenu(); handleLogout(); }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-slate"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header (Mobile menu trigger & User info) */}
        <header className="flex h-16 items-center justify-between border-b border-steel bg-void-soft px-4 sm:px-6 lg:px-8">
          <button
            className="md:hidden text-mist-bright hover:text-lightning"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm font-medium text-mist-bright hidden sm:block">
              {user?.username}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate text-lightning font-bold border border-steel">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-void p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

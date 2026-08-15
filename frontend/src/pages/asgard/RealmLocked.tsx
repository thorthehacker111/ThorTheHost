import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";

import { Navbar } from "@/components/landing/Navbar";

interface RealmLockedProps {
  title: string;
  message: string;
}

/**
 * Shared "this realm doesn't exist yet" layout, used by both
 * carders.tsx and rps.tsx so their placeholder pages stay visually
 * identical without duplicating markup. Not routed directly.
 */
export function RealmLocked({ title, message }: RealmLockedProps) {
  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />

      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-grid px-6 py-24 text-center">
        <div className="pointer-events-none absolute inset-0 animate-radial-pulse bg-forge-radial" />

        <div className="relative">
          <div className="animate-fade-up mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-steel bg-slate-elevated opacity-0 [animation-delay:0ms]">
            <Hammer className="h-7 w-7 text-lightning" />
          </div>

          <h1 className="animate-fade-up mt-6 font-display text-3xl font-bold text-foreground opacity-0 [animation-delay:120ms] sm:text-4xl">
            {title}
          </h1>

          <p className="animate-fade-up mx-auto mt-4 max-w-sm text-balance text-sm leading-7 text-mist opacity-0 [animation-delay:240ms] sm:text-base">
            {message}
          </p>

          <Link
            to="/asgard"
            className="animate-fade-up mt-8 inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-5 py-2 font-mono text-xs uppercase tracking-widest text-mist opacity-0 transition-colors duration-300 [animation-delay:360ms] hover:border-lightning/50 hover:text-lightning"
          >
            ← Back to Asgard
          </Link>
        </div>

        <style>{`
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up { animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes radial-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .animate-radial-pulse { animation: radial-pulse 6s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .animate-fade-up, .animate-radial-pulse { animation: none; opacity: 1; }
          }
        `}</style>
      </main>
    </div>
  );
}
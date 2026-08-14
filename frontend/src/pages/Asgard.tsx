import { useCallback, useRef } from "react";

import { Navbar } from "@/components/landing/Navbar";

export default function Asgard() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();

      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      section.style.setProperty("--spot-x", `${x}%`);
      section.style.setProperty("--spot-y", `${y}%`);
    },
    [],
  );

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <section
          ref={sectionRef}
          onMouseMove={handleMouseMove}
          className="group relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-grid"
          style={
            {
              "--spot-x": "50%",
              "--spot-y": "35%",
            } as React.CSSProperties
          }
        >
          <div className="pointer-events-none absolute inset-0 animate-radial-pulse bg-forge-radial" />

          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(250,204,21,0.10), transparent 70%)",
            }}
          />

          <div className="container relative mx-auto w-full max-w-2xl px-6 py-24 text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-3 py-1 font-mono text-xs uppercase tracking-widest text-lightning opacity-0 [animation-delay:0ms]">
              The realm of the honored
            </span>

            <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-foreground opacity-0 [animation-delay:120ms] sm:text-5xl">
              Asgard
            </h1>

            <p className="animate-fade-up mx-auto mt-5 max-w-md text-balance text-sm leading-7 text-mist opacity-0 [animation-delay:240ms] sm:text-base">
              Coming soon — a hall for the hosters, admins, and builders worth
              knowing about.
            </p>
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
        </section>
      </main>
    </div>
  );
}
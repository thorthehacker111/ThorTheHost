import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    section.style.setProperty("--spot-x", `${x}%`);
    section.style.setProperty("--spot-y", `${y}%`);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-1 flex-col overflow-hidden bg-grid"
      style={{ "--spot-x": "50%", "--spot-y": "40%" } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 animate-radial-pulse bg-forge-radial" />

      {/* cursor-reactive spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--spot-x) var(--spot-y), rgba(250,204,21,0.10), transparent 70%)",
        }}
      />

      {/* ambient drifting sparks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="spark spark-1" />
        <span className="spark spark-2" />
        <span className="spark spark-3" />
        <span className="spark spark-4" />
        <span className="spark spark-5" />
      </div>

      <div className="container relative flex flex-1 flex-col items-center justify-center py-16 text-center">
        <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-3 py-1 font-mono text-xs uppercase tracking-widest text-lightning opacity-0 transition-colors duration-300 [animation-delay:0ms] hover:border-lightning hover:bg-slate-elevated/80 hover:shadow-[0_0_16px_rgba(250,204,21,0.25)]">
          Privacy-first email forwarding
        </span>

        <h1 className="mt-6 max-w-3xl text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          <span className="animate-fade-up inline-block opacity-0 [animation-delay:120ms]">
            Give every signup its own
          </span>{" "}
          <span className="animate-fade-up group/word relative inline-block cursor-default text-lightning opacity-0 [animation-delay:260ms]">
            <span className="animate-crackle relative z-10 transition-[text-shadow] duration-300 group-hover/word:drop-shadow-[0_0_20px_rgba(250,204,21,0.55)]">
              lightning-forged
            </span>
          </span>{" "}
          <span className="animate-fade-up inline-block opacity-0 [animation-delay:340ms]">
            alias.
          </span>
        </h1>

        <div className="animate-fade-up mt-10 opacity-0 [animation-delay:480ms]">
          <Button
            asChild
            size="lg"
            className="group/btn relative overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(250,204,21,0.35)]"
          >
            <Link to="/register">
              <span className="relative z-10">Create your first alias</span>
              <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover/btn:translate-x-full" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="animate-fade-up relative pb-6 text-center font-mono text-xs uppercase tracking-widest text-mist opacity-0 [animation-delay:600ms]">
        Made with{" "}
        <span className="inline-block transition-transform duration-300 hover:scale-125">❤️</span>{" "}
        from{" "}
        <span className="text-lightning transition-[text-shadow] duration-300 hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]">
          ⚡THOR
        </span>
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

        @keyframes crackle {
          0%, 92%, 100% { opacity: 1; }
          93% { opacity: 0.5; }
          94% { opacity: 1; }
          95% { opacity: 0.6; }
          96% { opacity: 1; }
        }
        .animate-crackle { animation: crackle 5s ease-in-out infinite; }

        .spark {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: rgba(250, 204, 21, 0.7);
          box-shadow: 0 0 6px 1px rgba(250, 204, 21, 0.45);
        }
        .spark-1 { top: 20%; left: 15%; animation: drift-a 9s ease-in-out infinite; }
        .spark-2 { top: 65%; left: 80%; animation: drift-b 11s ease-in-out infinite; animation-delay: 1s; }
        .spark-3 { top: 40%; left: 50%; animation: drift-c 8s ease-in-out infinite; animation-delay: 2.5s; }
        .spark-4 { top: 80%; left: 25%; animation: drift-a 13s ease-in-out infinite; animation-delay: 4s; }
        .spark-5 { top: 12%; left: 70%; animation: drift-b 10s ease-in-out infinite; animation-delay: 0.5s; }

        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(20px, -30px); opacity: 0.8; }
          90% { opacity: 0.2; }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translate(-25px, -20px); opacity: 0.7; }
          85% { opacity: 0.1; }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translate(15px, 25px); opacity: 0.6; }
          80% { opacity: 0.2; }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-up, .animate-radial-pulse, .animate-crackle, .spark {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
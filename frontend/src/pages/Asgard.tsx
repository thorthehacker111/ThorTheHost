import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/landing/Navbar";

/**
 * Featured entries shown on the Asgard page.
 *
 * To add or edit entries, just update this array — nothing else in the
 * file needs to change. Images are read from
 * `frontend/public/assets/asgard/MainScreen/<file>` and referenced here
 * as `/assets/asgard/MainScreen/<file>` (Vite serves everything in
 * `public/` from the site root).
 *
 * `to` is an internal route (client-side navigation, no new tab) — see
 * the matching routes added in App.tsx and the pages under
 * `src/pages/asgard/`.
 *
 * With exactly 3 entries, the middle one renders visually elevated
 * ("dominant") on desktop — see `isDominant` below.
 */
interface AsgardEntry {
  title: string;
  role: string;
  blurb: string;
  to: string;
  logo: string;
}

const ASGARD_ENTRIES: AsgardEntry[] = [
  {
    title: "Carders",
    role: "Weapon Smith",
    blurb: "Crafting cards and lightning-fast solutions for the warriors.",
    to: "/asgard/carders",
    logo: "/assets/asgard/MainScreen/card1.png",
  },
  {
    title: "Top Hosters",
    role: "Server Architect",
    blurb: "Wielding the thunder to keep the best hosting standing against others.",
    to: "/asgard/tophosters",
    logo: "/assets/asgard/MainScreen/card2.png",
  },
  {
    title: "Red Packet Sellers",
    role: "Vault Keeper",
    blurb: "Legendary sellers of coins, red packets, and wealth across the realm.",
    to: "/asgard/rps",
    logo: "/assets/asgard/MainScreen/card3.png",
  },
];

function getInitials(title: string): string {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function AsgardCard({
  entry,
  index,
  isDominant,
}: {
  entry: AsgardEntry;
  index: number;
  isDominant: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link
      to={entry.to}
      className={`group/card relative flex flex-col items-center rounded-2xl border bg-void/70 p-6 text-center opacity-0 backdrop-blur-sm transition-colors transition-shadow duration-300 ${
        isDominant
          ? "asgard-dominant-card border-lightning/60"
          : "asgard-normal-card border-steel hover:border-lightning/50 hover:bg-slate-elevated/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.1)]"
      }`}
      style={{ animationDelay: `${320 + index * 100}ms` }}
    >
      {!imgFailed ? (
        <img
          src={entry.logo}
          alt={entry.title}
          className={`shrink-0 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover/card:scale-105 group-hover/card:drop-shadow-[0_0_16px_rgba(250,204,21,0.35)] ${
            isDominant ? "h-[7.8rem] w-[7.8rem]" : "h-[6.5rem] w-[6.5rem]"
          }`}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className={`flex shrink-0 items-center justify-center rounded-2xl border border-steel bg-slate-elevated font-display font-semibold text-lightning transition-all duration-300 group-hover/card:border-lightning/60 group-hover/card:shadow-[0_0_18px_rgba(250,204,21,0.18)] ${
            isDominant ? "h-[7.8rem] w-[7.8rem] text-2xl" : "h-[6.5rem] w-[6.5rem] text-xl"
          }`}
        >
          {getInitials(entry.title)}
        </div>
      )}

      <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
        {entry.title}
      </h2>

      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-lightning/80">
        {entry.role}
      </p>

      <p className="mt-3 text-sm leading-6 text-mist">{entry.blurb}</p>
    </Link>
  );
}

export default function Asgard() {
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
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <section
          ref={sectionRef}
          onMouseMove={handleMouseMove}
          className="group relative flex flex-1 flex-col overflow-hidden bg-grid"
          style={
            {
              "--spot-x": "50%",
              "--spot-y": "20%",
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

          <div className="container relative mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
            {/* Page heading */}
            <div className="mb-16 text-center sm:mb-20">
              <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-3 py-1 font-mono text-xs uppercase tracking-widest text-lightning opacity-0 [animation-delay:0ms]">
                The realm of the honored
              </span>

              <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-foreground opacity-0 [animation-delay:120ms] sm:text-5xl">
                Asgard
              </h1>

              <p className="animate-fade-up mx-auto mt-5 max-w-lg text-balance text-sm leading-7 text-mist opacity-0 [animation-delay:240ms] sm:text-base">
                Where legendary Hosters, Carders, and Red packet sellers claim
                their throne.
              </p>
            </div>

            {/* Card grid */}
            <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {ASGARD_ENTRIES.map((entry, index) => (
                <AsgardCard
                  key={entry.title}
                  entry={entry}
                  index={index}
                  isDominant={ASGARD_ENTRIES.length === 3 && index === 1}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative pb-6 pt-10 text-center font-mono text-xs uppercase tracking-widest text-mist">
            Made with{" "}
            <span className="inline-block transition-transform duration-300 hover:scale-125">
              ❤️
            </span>{" "}
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

            /*
              Cards use their own dedicated entrance keyframes (rather than
              sharing .animate-fade-up) so the resting position they land
              on — flat, pushed down, or pushed up — is baked directly into
              the animation's own end state. A separate static "transform"
              rule would silently lose to the animation's forwards-held
              value, which is what caused the middle card to never
              visibly move.
            */
            @keyframes asgard-card-enter-normal {
              from { opacity: 0; transform: translateY(14px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (min-width: 640px) {
              @keyframes asgard-card-enter-normal {
                from { opacity: 0; transform: translateY(14px); }
                to { opacity: 1; transform: translateY(1rem); }
              }
            }
            .asgard-normal-card {
              animation: asgard-card-enter-normal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes asgard-card-enter-dominant {
              from { opacity: 0; transform: translateY(14px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (min-width: 640px) {
              @keyframes asgard-card-enter-dominant {
                from { opacity: 0; transform: translateY(14px); }
                to { opacity: 1; transform: translateY(-2rem); }
              }
            }
            .asgard-dominant-card {
              animation: asgard-card-enter-dominant 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                         asgard-card-glow 2.6s ease-in-out infinite;
            }
            @keyframes asgard-card-glow {
              0%, 100% { box-shadow: 0 0 16px rgba(245, 176, 39, 0.14); }
              50% { box-shadow: 0 0 28px rgba(245, 176, 39, 0.32); }
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-fade-up,
              .animate-radial-pulse,
              .asgard-normal-card,
              .asgard-dominant-card {
                animation: none !important;
                opacity: 1;
                transform: none;
              }
              .asgard-dominant-card {
                box-shadow: 0 0 16px rgba(245, 176, 39, 0.14);
              }
            }
          `}</style>
        </section>
      </main>
    </div>
  );
}
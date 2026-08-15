import { useState } from "react";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/landing/Navbar";
import { TOP_HOSTERS } from "@/pages/asgard/topHostersData";

// TODO: replace with the real Google Form link once it's ready.
const SUBMISSION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdF_ukQhEPZpay8euCi18ZjVLchgmd0_FKyLA5NBBLcy9zj8Q/viewform?usp=dialog#";

type Metal = "gold" | "silver" | "bronze";

const METAL_STYLES: Record<
  Metal,
  { ring: string; glow: string; badge: string; particle: string }
> = {
  gold: {
    ring: "border-lightning",
    glow: "shadow-[0_0_28px_rgba(245,176,39,0.45)]",
    badge: "bg-lightning text-void",
    particle: "bg-lightning shadow-[0_0_6px_2px_rgba(245,176,39,0.7)]",
  },
  silver: {
    ring: "border-slate-300",
    glow: "shadow-[0_0_22px_rgba(203,213,225,0.35)]",
    badge: "bg-slate-300 text-void",
    particle: "bg-slate-200 shadow-[0_0_6px_2px_rgba(203,213,225,0.6)]",
  },
  bronze: {
    ring: "border-amber-700",
    glow: "shadow-[0_0_22px_rgba(180,83,9,0.4)]",
    badge: "bg-amber-700 text-void",
    particle: "bg-amber-500 shadow-[0_0_6px_2px_rgba(180,83,9,0.6)]",
  },
};

function hosterImage(rank: number): string {
  return `/assets/asgard/TopHosters/top${rank}.png`;
}

function handleImageError(rank: number, name: string) {
  // Temporary debug log — safe to remove once images are confirmed working.
  console.error(
    `[Asgard] Image failed to load for rank ${rank} (${name}): ${hosterImage(
      rank,
    )}`,
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function PodiumAvatar({
  name,
  rank,
  metal,
  size,
}: {
  name: string;
  rank: number;
  metal: Metal;
  size: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const styles = METAL_STYLES[metal];

  return (
    <div className="flex flex-col items-center">
      <div
        className="asgard-podium-avatar relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* very few drifting sparks, color-matched to the metal */}
        <span className={`asgard-particle asgard-particle-a ${styles.particle}`} />
        <span className={`asgard-particle asgard-particle-b ${styles.particle}`} />

        <div
          className={`relative h-full w-full overflow-hidden rounded-full border-2 bg-slate-elevated ${styles.ring} ${styles.glow}`}
        >
          {!imgFailed ? (
            <img
              src={hosterImage(rank)}
              alt={name}
              className="h-full w-full object-cover"
              onError={() => {
                handleImageError(rank, name);
                setImgFailed(true);
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-xl font-semibold text-lightning">
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* rank badge */}
        <div
          className={`absolute -top-2 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold ${styles.badge}`}
        >
          {rank}
        </div>
      </div>

      <p className="mt-3 max-w-[9rem] truncate text-center text-base font-semibold text-foreground">
        {name}
      </p>
    </div>
  );
}

function ListRow({ name, rank }: { name: string; rank: number }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex items-center gap-4 border-b border-steel/60 px-4 py-3 last:border-b-0">
      <span className="w-6 shrink-0 text-center font-mono text-sm text-mist">
        {rank}
      </span>

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-steel bg-slate-elevated">
        {!imgFailed ? (
          <img
            src={hosterImage(rank)}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => {
              handleImageError(rank, name);
              setImgFailed(true);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-xs font-semibold text-lightning">
            {getInitials(name)}
          </div>
        )}
      </div>

      <p className="truncate text-base font-medium text-foreground">{name}</p>
    </div>
  );
}

export default function TopHosters() {
  const podiumConfigs: { rank: number; metal: Metal; size: number; order: string }[] = [
    { rank: 1, metal: "gold", size: 108, order: "order-2 -translate-y-4" },
    { rank: 2, metal: "silver", size: 84, order: "order-1" },
    { rank: 3, metal: "bronze", size: 84, order: "order-3" },
  ];

  // Only render podium slots for ranks that actually have a name yet.
  const podiumEntries = podiumConfigs
    .filter((config) => TOP_HOSTERS[config.rank - 1])
    .map((config) => ({ ...config, name: TOP_HOSTERS[config.rank - 1] }));

  const rest = TOP_HOSTERS.slice(3);
  const isEmpty = TOP_HOSTERS.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />

      <main className="relative flex flex-1 flex-col overflow-hidden bg-grid">
        <div className="pointer-events-none absolute inset-0 animate-radial-pulse bg-forge-radial" />

        <div className="container relative mx-auto w-full max-w-4xl px-6 py-16 md:py-20">
          {/* Breadcrumb */}
          <Link
            to="/asgard"
            className="animate-fade-up inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-mist opacity-0 transition-colors duration-300 [animation-delay:0ms] hover:text-lightning"
          >
            ← Asgard
          </Link>

          {/* Heading */}
          <div className="mb-14 mt-8 text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-3 py-1 font-mono text-xs uppercase tracking-widest text-lightning opacity-0 [animation-delay:80ms]">
              Server Architects
            </span>

            <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-foreground opacity-0 [animation-delay:180ms] sm:text-5xl">
              Top Hosters
            </h1>

            <p className="animate-fade-up mx-auto mt-5 max-w-md text-balance text-sm leading-7 text-mist opacity-0 [animation-delay:280ms] sm:text-base">
              Wielding the thunder to keep the best hosting standing against
              others.
            </p>
          </div>

          {/* Podium */}
          {podiumEntries.length > 0 && (
            <div className="animate-fade-up mb-16 flex items-end justify-center gap-6 opacity-0 [animation-delay:360ms] sm:gap-10">
              {podiumEntries.map((entry) => (
                <div key={entry.rank} className={entry.order}>
                  <PodiumAvatar
                    name={entry.name}
                    rank={entry.rank}
                    metal={entry.metal}
                    size={entry.size}
                  />
                </div>
              ))}
            </div>
          )}

          {/* List: rank 4 onward */}
          {rest.length > 0 && (
            <div className="animate-fade-up overflow-hidden rounded-2xl border border-steel bg-void/70 opacity-0 backdrop-blur-sm [animation-delay:460ms]">
              {rest.map((name, i) => (
                <ListRow key={`${name}-${i}`} name={name} rank={i + 4} />
              ))}
            </div>
          )}

          {/* Empty state: no names added yet */}
          {isEmpty && (
            <div className="animate-fade-up mx-auto max-w-md rounded-2xl border border-dashed border-steel bg-void/50 p-10 text-center opacity-0 [animation-delay:360ms]">
              <p className="font-display text-lg text-foreground">
                No hosters listed yet
              </p>
              <p className="mt-2 text-sm leading-6 text-mist">
                Add names to TOP_HOSTERS in topHostersData.ts to populate
                this leaderboard.
              </p>
            </div>
          )}

          {/* Submission CTA */}
          <div className="animate-fade-up mt-16 text-center opacity-0 [animation-delay:560ms]">
            <p className="text-sm text-mist">
              If you want to submit your name then fill the google form below
            </p>
            <a
              href={SUBMISSION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-lightning/40 px-6 py-2 font-display text-sm font-semibold text-lightning transition-colors duration-300 hover:bg-lightning/10"
            >
              Google Form
            </a>
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

          .asgard-particle {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 9999px;
            opacity: 0;
          }
          .asgard-particle-a {
            top: 10%;
            left: -6px;
            animation: asgard-particle-drift-a 5s ease-in-out infinite;
          }
          .asgard-particle-b {
            bottom: 14%;
            right: -6px;
            animation: asgard-particle-drift-b 6s ease-in-out infinite;
            animation-delay: 1.5s;
          }
          @keyframes asgard-particle-drift-a {
            0%, 100% { opacity: 0; transform: translate(0, 0); }
            15% { opacity: 0.9; }
            50% { transform: translate(-10px, -14px); opacity: 0.5; }
            85% { opacity: 0.1; }
          }
          @keyframes asgard-particle-drift-b {
            0%, 100% { opacity: 0; transform: translate(0, 0); }
            15% { opacity: 0.9; }
            50% { transform: translate(10px, 12px); opacity: 0.5; }
            85% { opacity: 0.1; }
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-fade-up, .animate-radial-pulse {
              animation: none;
              opacity: 1;
            }
            .asgard-particle {
              animation: none;
              opacity: 0;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
import { useState } from "react";

import { Navbar } from "@/components/landing/Navbar";
import { TOP_ADMINS, TOP_BANNERS, TOP_HOSTERS } from "@/pages/asgard/topHostersData";

// TODO: replace with the real Google Form link once it's ready.
const SUBMISSION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdF_ukQhEPZpay8euCi18ZjVLchgmd0_FKyLA5NBBLcy9zj8Q/viewform?usp=dialog#";

type Metal = "gold" | "silver" | "bronze";
type Section = "admins" | "hosters" | "banners";

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

// Section theme + data. Order here drives the on-screen order:
// Admins (blue) -> Hosters (gold) -> Banners (red).
const SECTION_ORDER: Section[] = ["admins", "hosters", "banners"];

const SECTIONS: Record<
  Section,
  {
    label: string;
    eyebrow: string;
    tagline: string;
    logo: string;
    imageFolder: string;
    data: string[];
    rgb: string; // "R,G,B" — drives the card glow, the pill, and the ambient wash
    border: string;
    text: string;
    ctaBorder: string;
    ctaHover: string;
  }
> = {
  admins: {
    label: "Top Admins",
    eyebrow: "Realm Guardians",
    tagline: "Those who keep order in Asgard and wield the ban-hammer well.",
    logo: "/assets/asgard/MainScreen/halloffame/card1.png",
    imageFolder: "TopAdmins",
    data: TOP_ADMINS,
    rgb: "59,130,246",
    border: "border-blue-400/70",
    text: "text-blue-400",
    ctaBorder: "border-blue-400/40",
    ctaHover: "hover:bg-blue-400/10",
  },
  hosters: {
    label: "Top Hosters",
    eyebrow: "Server Architects",
    tagline: "Wielding the thunder to keep the best hosting standing against others.",
    logo: "/assets/asgard/MainScreen/halloffame/card2.png",
    imageFolder: "TopHosters",
    data: TOP_HOSTERS,
    rgb: "245,176,39",
    border: "border-lightning/70",
    text: "text-lightning",
    ctaBorder: "border-lightning/40",
    ctaHover: "hover:bg-lightning/10",
  },
  banners: {
    label: "Top Banners",
    eyebrow: "Ban Hammer Wielders",
    tagline:
      "Feared across the realm for one thing — getting rival accounts banned before they even see it coming.",
    logo: "/assets/asgard/MainScreen/halloffame/card3.png",
    imageFolder: "TopBanners",
    data: TOP_BANNERS,
    rgb: "240,85,74",
    border: "border-danger/70",
    text: "text-danger",
    ctaBorder: "border-danger/40",
    ctaHover: "hover:bg-danger/10",
  },
};

function sectionImage(imageFolder: string, rank: number): string {
  return `/assets/asgard/${imageFolder}/top${rank}.png`;
}

function handleImageError(imageFolder: string, rank: number, name: string) {
  // Temporary debug log — safe to remove once images are confirmed working.
  console.error(
    `[Asgard] Image failed to load for rank ${rank} (${name}): ${sectionImage(
      imageFolder,
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
  imageFolder,
}: {
  name: string;
  rank: number;
  metal: Metal;
  size: number;
  imageFolder: string;
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
              src={sectionImage(imageFolder, rank)}
              alt={name}
              className="h-full w-full object-cover"
              onError={() => {
                handleImageError(imageFolder, rank, name);
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

function ListRow({
  name,
  rank,
  imageFolder,
}: {
  name: string;
  rank: number;
  imageFolder: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="flex items-center gap-4 border-b border-steel/60 px-4 py-3 last:border-b-0">
      <span className="w-6 shrink-0 text-center font-mono text-sm text-mist">
        {rank}
      </span>

      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-steel bg-slate-elevated">
        {!imgFailed ? (
          <img
            src={sectionImage(imageFolder, rank)}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => {
              handleImageError(imageFolder, rank, name);
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

/**
 * Desktop/tablet: three standalone glowing cards, one per section.
 *
 * Visually matches AsgardCard on the parent Asgard page (rounded-2xl,
 * bg-void/70, backdrop-blur-sm, p-6) rather than inventing a separate
 * card language. The glow itself is a continuous, subtle CSS animation
 * (`hof-card` / `hof-card-active`) driven by a `--glow-rgb` custom
 * property, so every card's color is set in one place (SECTIONS.rgb)
 * instead of hard-coded Tailwind shadow strings.
 */
function SectionCard({
  section,
  active,
  onSelect,
}: {
  section: Section;
  active: boolean;
  onSelect: (section: Section) => void;
}) {
  const theme = SECTIONS[section];

  return (
    <button
      type="button"
      onClick={() => onSelect(section)}
      aria-pressed={active}
      style={{ "--glow-rgb": theme.rgb } as React.CSSProperties}
      className={`group/card flex flex-col items-center justify-center rounded-2xl border bg-void/70 p-5 text-center backdrop-blur-sm transition-colors duration-300 sm:p-6 ${theme.border} ${
        active ? "hof-card-active" : "hof-card-idle opacity-80 hover:opacity-100"
      }`}
    >
      <img
        src={theme.logo}
        alt={theme.label}
        className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover/card:scale-105 sm:h-[4.6rem] sm:w-[4.6rem] md:h-[5.2rem] md:w-[5.2rem]"
      />
      <span
        className={`mt-3 font-display text-xs font-bold uppercase tracking-widest transition-colors duration-500 sm:text-sm ${
          active ? theme.text : "text-foreground"
        }`}
      >
        {theme.label}
      </span>
    </button>
  );
}

/**
 * Mobile: one rounded pill housing all three sections as compact tabs.
 * Uses the exact same font (font-display, uppercase, tracking-widest)
 * and glow classes as SectionCard so the switcher reads identically
 * whether it renders as three cards or one pill.
 */
function SectionPillSwitcher({
  active,
  onSelect,
}: {
  active: Section;
  onSelect: (section: Section) => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-sm items-center gap-1.5 rounded-2xl border border-steel bg-slate-elevated/70 p-1.5 backdrop-blur-sm md:hidden">
      {SECTION_ORDER.map((section) => {
        const theme = SECTIONS[section];
        const isActive = active === section;

        return (
          <button
            key={section}
            type="button"
            onClick={() => onSelect(section)}
            aria-pressed={isActive}
            style={{ "--glow-rgb": theme.rgb } as React.CSSProperties}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-2 transition-colors duration-300 ${
              isActive
                ? `${theme.border} bg-void/60 hof-card-active`
                : "border-transparent opacity-70"
            }`}
          >
            <img src={theme.logo} alt={theme.label} className="h-7 w-7 object-contain" />
            <span
              className={`text-center font-display text-[9px] font-bold uppercase leading-tight tracking-widest transition-colors duration-300 ${
                isActive ? theme.text : "text-foreground"
              }`}
            >
              {theme.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function HallOfFame() {
  const [activeSection, setActiveSection] = useState<Section>("hosters");
  const theme = SECTIONS[activeSection];

  const podiumConfigs: { rank: number; metal: Metal; size: number; order: string }[] = [
    { rank: 1, metal: "gold", size: 108, order: "order-2 -translate-y-4" },
    { rank: 2, metal: "silver", size: 84, order: "order-1" },
    { rank: 3, metal: "bronze", size: 84, order: "order-3" },
  ];

  // Only render podium slots for ranks that actually have a name yet.
  const podiumEntries = podiumConfigs
    .filter((config) => theme.data[config.rank - 1])
    .map((config) => ({ ...config, name: theme.data[config.rank - 1] }));

  const rest = theme.data.slice(3);
  const isEmpty = theme.data.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <Navbar />

      <main className="relative flex flex-1 flex-col overflow-hidden bg-grid">
        <div className="pointer-events-none absolute inset-0 animate-radial-pulse bg-forge-radial" />

        <div className="container relative mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
          {/* Heading */}
          <div className="mb-10 text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-3 py-1 font-mono text-xs uppercase tracking-widest text-lightning opacity-0 [animation-delay:0ms]">
              Legends Keepers
            </span>

            <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-foreground opacity-0 [animation-delay:100ms] sm:text-5xl">
              Hall of Fame
            </h1>

            <p className="animate-fade-up mx-auto mt-5 max-w-md text-balance text-sm leading-7 text-mist opacity-0 [animation-delay:200ms] sm:text-base">
              Where the realm's greatest names are etched in gold for all
              eternity.
            </p>
          </div>

          {/* Aesthetic separator — visible but not a hard break */}
          <div className="animate-fade-up relative my-10 opacity-0 [animation-delay:280ms] sm:my-12">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-steel to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mist shadow-[0_0_10px_2px_rgba(142,154,179,0.4)]" />
          </div>

          {/* Section switcher: three glowing cards on desktop, a single pill on mobile */}
          <div className="animate-fade-up mb-14 opacity-0 [animation-delay:340ms]">
            <div className="hidden grid-cols-3 gap-4 sm:gap-6 md:grid">
              {SECTION_ORDER.map((section) => (
                <SectionCard
                  key={section}
                  section={section}
                  active={activeSection === section}
                  onSelect={setActiveSection}
                />
              ))}
            </div>
            <SectionPillSwitcher active={activeSection} onSelect={setActiveSection} />
          </div>

          {/* Everything below this point is themed to the active section. The
              page background stays the same void — only an ambient glow wash
              shifts color, so the card row above reads as a seamless
              continuation rather than a hard-cut zone. */}
          <div className="relative">
            {SECTION_ORDER.map((section) => (
              <div
                key={section}
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700 ease-out"
                style={{
                  opacity: activeSection === section ? 1 : 0,
                  backgroundImage: `radial-gradient(circle at 50% 0%, rgba(${SECTIONS[section].rgb},0.16), transparent 65%)`,
                }}
              />
            ))}

            <div key={activeSection}>
              {/* Section label */}
              <div className="animate-fade-up mb-12 text-center opacity-0 [animation-delay:60ms]">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border bg-slate-elevated/60 px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors duration-500 ${theme.ctaBorder} ${theme.text}`}
                >
                  {theme.eyebrow}
                </span>
                <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-6 text-mist sm:text-base">
                  {theme.tagline}
                </p>
              </div>

              {/* Podium */}
              {podiumEntries.length > 0 && (
                <div className="animate-fade-up mb-16 flex items-end justify-center gap-6 opacity-0 [animation-delay:140ms] sm:gap-10">
                  {podiumEntries.map((entry) => (
                    <div key={entry.rank} className={entry.order}>
                      <PodiumAvatar
                        name={entry.name}
                        rank={entry.rank}
                        metal={entry.metal}
                        size={entry.size}
                        imageFolder={theme.imageFolder}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* List: rank 4 onward */}
              {rest.length > 0 && (
                <div className="animate-fade-up overflow-hidden rounded-2xl border border-steel bg-void/70 opacity-0 backdrop-blur-sm [animation-delay:220ms]">
                  {rest.map((name, i) => (
                    <ListRow
                      key={`${name}-${i}`}
                      name={name}
                      rank={i + 4}
                      imageFolder={theme.imageFolder}
                    />
                  ))}
                </div>
              )}

              {/* Empty state: no names added yet for this section */}
              {isEmpty && (
                <div className="animate-fade-up mx-auto max-w-md rounded-2xl border border-dashed border-steel bg-void/50 p-10 text-center opacity-0 [animation-delay:140ms]">
                  <p className="font-display text-lg text-foreground">
                    No {theme.label.toLowerCase()} listed yet
                  </p>
                  <p className="mt-2 text-sm leading-6 text-mist">
                    Add names to TOP_{activeSection.toUpperCase()} in
                    topHostersData.ts to populate this leaderboard.
                  </p>
                </div>
              )}

              {/* Submission CTA */}
              <div className="animate-fade-up mt-16 text-center opacity-0 [animation-delay:300ms]">
                <p className="text-sm text-mist">
                  If you want to submit your name then fill the google form below
                </p>
                <a
                  href={SUBMISSION_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-2 rounded-full border px-6 py-2 font-display text-sm font-semibold transition-colors duration-500 ${theme.ctaBorder} ${theme.text} ${theme.ctaHover}`}
                >
                  Google Form
                </a>
              </div>
            </div>
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
          .animate-fade-up { animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          @keyframes radial-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .animate-radial-pulse { animation: radial-pulse 6s ease-in-out infinite; }

          /*
            Section-switcher glow — color comes entirely from the
            --glow-rgb custom property each card/pill-tab sets inline
            (from SECTIONS.rgb), so blue/gold/red share one animation.
            Idle cards pulse gently so all three always read as "alive";
            the active one pulses brighter/wider.
          */
          @keyframes hof-card-glow-idle {
            0%, 100% { box-shadow: 0 0 14px rgba(var(--glow-rgb), 0.22); }
            50% { box-shadow: 0 0 24px rgba(var(--glow-rgb), 0.4); }
          }
          @keyframes hof-card-glow-active {
            0%, 100% { box-shadow: 0 0 22px rgba(var(--glow-rgb), 0.4); }
            50% { box-shadow: 0 0 38px rgba(var(--glow-rgb), 0.68); }
          }
          .hof-card-idle { animation: hof-card-glow-idle 2.6s ease-in-out infinite; }
          .hof-card-active { animation: hof-card-glow-active 2.6s ease-in-out infinite; }

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
            .hof-card-idle, .hof-card-active {
              animation: none;
              box-shadow: 0 0 16px rgba(var(--glow-rgb), 0.3);
            }
          }
        `}</style>
      </main>
    </div>
  );
}
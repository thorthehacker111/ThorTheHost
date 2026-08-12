import { useEffect, useState } from "react";

// A small local sample of the real word lists used by the alias generator
// (Phase 4 ships the full 1024-word adjective/noun lists). This preview
// intentionally mirrors the real generation format exactly:
// word1_word2NNNN
const ADJECTIVES = ["forest", "river", "apple", "amber", "iron", "storm", "winter", "quiet"];
const NOUNS = ["tiger", "cloud", "hawk", "wolf", "raven", "ember", "cedar", "falcon"];

function randomAlias(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const digits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${adjective}_${noun}${digits}`;
}

/**
 * A rune-tablet styled panel that periodically "forges" a new alias,
 * demonstrating -- live, on the landing page -- exactly what the product
 * does. Respects prefers-reduced-motion via the shared CSS rule that zeroes
 * animation durations globally.
 */
export function AliasForgePanel() {
  const [alias, setAlias] = useState(randomAlias);
  const [struck, setStruck] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStruck(false);
      // Re-trigger the strike animation on the next paint.
      window.requestAnimationFrame(() => {
        setAlias(randomAlias());
        setStruck(true);
      });
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      {/* Ambient glow behind the tablet */}
      <div className="absolute inset-0 -z-10 bg-forge-radial blur-2xl" />

      <div className="rounded-xl border border-steel bg-slate/80 p-6 shadow-glow backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-steel pb-4">
          <span className="font-mono text-xs uppercase tracking-widest text-mist">
            alias forge
          </span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            live
          </span>
        </div>

        <div className="py-8 text-center">
          <p className="mb-2 font-mono text-xs text-mist">new alias generated</p>
          <p
            key={alias}
            className={`break-all font-mono text-xl font-medium text-lightning sm:text-2xl ${
              struck ? "animate-strike" : "opacity-0"
            }`}
          >
            {alias}
            <span className="text-mist">@thorthehost.in</span>
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-void/60 px-4 py-3 font-mono text-xs text-mist">
          <span>forwards to</span>
          <span className="text-bifrost">you@your-real-inbox.com</span>
        </div>
      </div>
    </div>
  );
}

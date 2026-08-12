import { BarChart3, KeyRound, MailCheck, ShieldCheck, ToggleLeft, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Aliases forged instantly",
    description:
      "Generate a unique, random alias in one click -- no picking usernames, no waiting. Every alias is permanently yours once created.",
  },
  {
    icon: ToggleLeft,
    title: "Disable without losing it",
    description:
      "Getting spam on one alias? Disable it instantly. Mail stops forwarding immediately, and the alias can never be reused by anyone else.",
  },
  {
    icon: MailCheck,
    title: "One verified inbox",
    description:
      "Point every alias at a single forwarding address. We verify it before any mail is delivered, so typos never send mail into the void.",
  },
  {
    icon: BarChart3,
    title: "See what's happening",
    description:
      "Track how many emails each alias has received and when the last one arrived, right from your dashboard.",
  },
  {
    icon: KeyRound,
    title: "Argon2-hashed passwords",
    description:
      "Your password is never stored in plain text or reversibly encrypted -- only a modern, memory-hard Argon2 hash ever touches disk.",
  },
  {
    icon: ShieldCheck,
    title: "Built on hardened auth",
    description:
      "Short-lived access tokens, rotating refresh tokens, and rate-limited login attempts protect your account from the start.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-steel/60 py-24 sm:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-lightning">
            Features
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Everything you need, nothing you have to configure.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-steel bg-slate/60 p-6 transition-colors hover:border-lightning/40"
            >
              <feature.icon
                className="h-6 w-6 text-lightning transition-transform group-hover:scale-110"
                strokeWidth={1.75}
              />
              <h3 className="mt-4 font-display text-lg text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Check } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const TIERS: Tier[] = [
  {
    name: "Apprentice",
    price: "$0",
    cadence: "forever",
    description: "Enough for one real inbox to hide behind a wall of aliases.",
    features: [
      "Up to 50 active aliases",
      "One verified forwarding address",
      "Enable / disable aliases anytime",
      "Basic mail statistics",
    ],
    cta: "Start free",
  },
  {
    name: "Einherjar",
    price: "$4",
    cadence: "/ month",
    description: "For people who forge a new alias for every service they sign up for.",
    features: [
      "Up to 500 active aliases",
      "Priority mail delivery",
      "Full statistics & mail history",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start free trial",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-steel/60 py-24 sm:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-widest text-lightning">
            Pricing
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Simple pricing. Finalized before launch.
          </h2>
          <p className="mt-3 text-mist">
            The tiers below are placeholders while we finish testing usage limits. Nothing here is
            billed yet.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex flex-col rounded-xl border p-8",
                tier.highlighted
                  ? "border-lightning/50 bg-slate-elevated shadow-glow-sm"
                  : "border-steel bg-slate/60",
              )}
            >
              <h3 className="font-display text-xl text-foreground">{tier.name}</h3>
              <p className="mt-2 text-sm text-mist">{tier.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl text-foreground">{tier.price}</span>
                <span className="text-sm text-mist">{tier.cadence}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-mist">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lightning" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={tier.highlighted ? "primary" : "secondary"}
                className="mt-8"
              >
                <Link to="/register">{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useCallback, useRef } from "react";
// import { Link } from "react-router-dom";

import { Navbar } from "@/components/landing/Navbar";

const STEPS = [
  {
    number: "01",
    title: "Reset your device",
    description:
      "Reset your device before starting the process so you begin with a clean environment.",
  },
  {
    number: "02",
    title: "Login or sign up",
    description:
      "Login or create your account here, then verify your account through Cloudflare using the account where you want to receive the OTP.",
  },
  {
    number: "03",
    title: "Install the required apps",
    description:
      "Download WePlay and X, then make sure Google Chrome is updated to the latest available version.",
  },
  {
    number: "04",
    title: "Forge an alias",
    description:
      "From the main dashboard, click Forge Alias and create a temporary account.",
  },
  {
    number: "05",
    title: "Create your X account",
    description:
      "Enter the temporary account details in X and create your account using those details.",
  },
  {
    number: "06",
    title: "Sign up on WePlay",
    description:
      "Finally, use the same account details to sign up for WePlay.",
  },
];

export default function HowToUse() {
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
          className="group relative flex flex-1 flex-col overflow-hidden bg-grid"
          style={
            {
              "--spot-x": "50%",
              "--spot-y": "35%",
            } as React.CSSProperties
          }
        >
          {/* Forge ambient glow */}
          <div className="pointer-events-none absolute inset-0 animate-radial-pulse bg-forge-radial" />

          {/* Cursor-reactive spotlight */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(280px circle at var(--spot-x) var(--spot-y), rgba(250,204,21,0.10), transparent 70%)",
            }}
          />

          {/* Ambient sparks */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="spark spark-1" />
            <span className="spark spark-2" />
            <span className="spark spark-3" />
            <span className="spark spark-4" />
            <span className="spark spark-5" />
          </div>

          {/* Content */}
          <div className="container relative mx-auto w-full max-w-5xl px-6 py-16 md:py-20">
            {/* Page heading */}
            <div className="mb-14 text-center">
              <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-steel bg-slate-elevated px-3 py-1 font-mono text-xs uppercase tracking-widest text-lightning opacity-0 [animation-delay:0ms]">
                Getting started
              </span>

              <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold leading-tight text-foreground opacity-0 [animation-delay:120ms] sm:text-5xl lg:text-6xl">
                How to use?
              </h1>

              <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-balance text-sm leading-7 text-mist opacity-0 [animation-delay:240ms] sm:text-base">
                Follow these steps to get started with ThorTheHost and forge
                your first temporary account.
              </p>
            </div>

            {/* Steps */}
            <div className="relative">
              {/* Timeline */}
              <div className="absolute bottom-10 left-7 top-10 hidden w-px bg-gradient-to-b from-lightning/50 via-steel to-transparent md:block" />

              <div className="space-y-5">
                {STEPS.map((step, index) => (
                  <div
                    key={step.number}
                    className="animate-fade-up group/step relative flex gap-5 rounded-2xl border border-steel bg-void/70 p-5 opacity-0 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-lightning/50 hover:bg-slate-elevated/50 hover:shadow-[0_0_30px_rgba(250,204,21,0.08)] sm:p-6 md:gap-6"
                    style={{
                      animationDelay: `${320 + index * 100}ms`,
                    }}
                  >
                    {/* Number */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-steel bg-slate-elevated font-mono text-sm font-semibold text-lightning transition-all duration-300 group-hover/step:border-lightning/60 group-hover/step:shadow-[0_0_18px_rgba(250,204,21,0.18)]">
                      {step.number}
                    </div>

                    {/* Step content */}
                    <div className="min-w-0 pt-0.5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lightning/80">
                        Step {index + 1}
                      </p>

                      <h2 className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-foreground sm:text-2xl">
                        {step.title}
                      </h2>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-mist sm:text-[15px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="animate-fade-up mt-14 rounded-2xl border border-steel bg-void/70 p-7 text-center opacity-0 backdrop-blur-sm [animation-delay:950ms] sm:p-9">
              <p className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                Having issues?
              </p>

              <p className="mt-2 text-sm text-mist">
                Any issues? Contact me on Telegram
              </p>

              <a
                href="https://t.me/thorthehost"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-mono text-sm text-lightning transition-[text-shadow] duration-300 hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
              >
                @thorthehost
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="relative pb-6 text-center font-mono text-xs uppercase tracking-widest text-mist">
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
              from {
                opacity: 0;
                transform: translateY(14px);
              }

              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fade-up {
              animation: fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes radial-pulse {
              0%, 100% {
                opacity: 1;
              }

              50% {
                opacity: 0.7;
              }
            }

            .animate-radial-pulse {
              animation: radial-pulse 6s ease-in-out infinite;
            }

            .spark {
              position: absolute;
              width: 3px;
              height: 3px;
              border-radius: 9999px;
              background: rgba(250, 204, 21, 0.7);
              box-shadow: 0 0 6px 1px rgba(250, 204, 21, 0.45);
            }

            .spark-1 {
              top: 20%;
              left: 15%;
              animation: drift-a 9s ease-in-out infinite;
            }

            .spark-2 {
              top: 65%;
              left: 80%;
              animation: drift-b 11s ease-in-out infinite;
              animation-delay: 1s;
            }

            .spark-3 {
              top: 40%;
              left: 50%;
              animation: drift-c 8s ease-in-out infinite;
              animation-delay: 2.5s;
            }

            .spark-4 {
              top: 80%;
              left: 25%;
              animation: drift-a 13s ease-in-out infinite;
              animation-delay: 4s;
            }

            .spark-5 {
              top: 12%;
              left: 70%;
              animation: drift-b 10s ease-in-out infinite;
              animation-delay: 0.5s;
            }

            @keyframes drift-a {
              0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
              }

              10% {
                opacity: 1;
              }

              50% {
                transform: translate(20px, -30px);
                opacity: 0.8;
              }

              90% {
                opacity: 0.2;
              }
            }

            @keyframes drift-b {
              0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
              }

              15% {
                opacity: 1;
              }

              50% {
                transform: translate(-25px, -20px);
                opacity: 0.7;
              }

              85% {
                opacity: 0.1;
              }
            }

            @keyframes drift-c {
              0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
              }

              20% {
                opacity: 1;
              }

              50% {
                transform: translate(15px, 25px);
                opacity: 0.6;
              }

              80% {
                opacity: 0.2;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-fade-up,
              .animate-radial-pulse,
              .spark {
                animation: none;
                opacity: 1;
              }
            }
          `}</style>
        </section>
      </main>
    </div>
  );
}
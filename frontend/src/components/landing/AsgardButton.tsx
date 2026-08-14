import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface AsgardButtonProps {
  /** "nav" = compact inline button for the desktop navbar.
   *  "block" = full-width button for the mobile dropdown menu. */
  variant?: "nav" | "block";
  onClick?: () => void;
}

export function AsgardButton({ variant = "nav", onClick }: AsgardButtonProps) {
  const isBlock = variant === "block";

  return (
    <div className={`asgard-ring ${isBlock ? "flex w-full" : "inline-flex"}`}>
      <Link
        to="/asgard"
        onClick={onClick}
        className={`asgard-ring-inner group inline-flex items-center gap-1.5 rounded-full font-display font-semibold tracking-wide text-lightning transition-colors duration-300 hover:text-lightning-hot ${
          isBlock
            ? "w-full justify-center px-4 py-2.5 text-sm"
            : "px-5 py-1.5 text-sm"
        }`}
      >
        <Zap className="h-3.5 w-3.5 animate-flicker fill-lightning text-lightning transition-colors duration-300 group-hover:fill-lightning-hot group-hover:text-lightning-hot" />
        Asgard
      </Link>

      <style>{`
        @property --asgard-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }

        .asgard-ring {
          position: relative;
          border-radius: 9999px;
          padding: 1.5px;
          background: conic-gradient(
            from var(--asgard-angle),
            rgba(245, 176, 39, 0.22),
            rgba(245, 176, 39, 0.22) 78%,
            #ffe9b3 90%,
            rgba(245, 176, 39, 0.22) 100%
          );
          animation: asgard-rotate 5s linear infinite;
          transition: box-shadow 0.3s ease, animation-duration 0.3s ease;
        }

        .asgard-ring:hover {
          animation-duration: 1.8s;
          box-shadow: 0 0 16px rgba(245, 176, 39, 0.4);
        }

        .asgard-ring-inner {
          background: #0d1127;
        }

        @keyframes asgard-rotate {
          to {
            --asgard-angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .asgard-ring {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
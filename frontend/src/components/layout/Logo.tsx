import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

/**
 * The ThorTheHost mark: a forged hammer struck by a bolt of lightning.
 */
export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-1.8", className)}>
<img
  src="/assets/favicon.svg"
  alt="ThorTheHost"
  width={23}
  height={25}
  className="shrink-0"
/>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-wide text-foreground">
          Thor<span className="text-lightning">The</span>Host
        </span>
      )}
    </div>
  );
}
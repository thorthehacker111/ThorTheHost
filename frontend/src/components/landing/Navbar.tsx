import { Link } from "react-router-dom";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-steel/70 bg-void/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" aria-label="ThorTheHost home">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          {/* How to use button */}
          <Button asChild variant="ghost" size="sm">
            <Link to="/how-to-use">How to use?!</Link>
          </Button>

          {/* Login button */}
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>

          {/* Get started button */}
          <Button asChild size="sm">
            <Link to="/register">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
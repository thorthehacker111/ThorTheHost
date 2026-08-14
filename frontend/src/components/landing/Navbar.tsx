import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/how-to-use", label: "How to use?!" },
  { to: "/login", label: "Log in" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-steel/70 bg-void/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          aria-label="ThorTheHost home"
          onClick={() => setIsOpen(false)}
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/how-to-use">How to use?!</Link>
          </Button>

          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>

          {/* Asgard button */}
          <Button asChild variant="outline" size="sm">
            <Link to="/asgard">Asgard</Link>
          </Button>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-mist transition-colors hover:text-foreground md:hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {isOpen && (
        <div className="border-t border-steel/70 bg-void/95 backdrop-blur-md md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-mist transition-colors hover:bg-slate-elevated hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/asgard"
              onClick={() => setIsOpen(false)}
              className="mt-1 rounded-md border border-lightning/40 px-3 py-2.5 text-sm text-lightning transition-colors hover:bg-lightning/10"
            >
              Asgard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
import { Logo } from "@/components/layout/Logo";

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-steel/60 py-14">
      <div className="container flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-mist">
            Email alias forwarding, forged for people who don't want their real address scattered
            across the internet.
          </p>
        </div>

        <div className="flex gap-16">
          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="font-mono text-xs uppercase tracking-widest text-mist">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-mist transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-12 border-t border-steel/60 pt-6">
        <p className="text-xs text-mist">
          © {new Date().getFullYear()} ThorTheHost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

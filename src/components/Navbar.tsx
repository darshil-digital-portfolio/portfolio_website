"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from "./icons";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certs" },
  { href: "#articles", label: "Writing" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bar">
      <nav className="bar-inner">
        <a href="#top" className="brand">
          <span className="glyph">DK</span>
          <span className="wordmark">Darshil Kapadia</span>
        </a>

        <div className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="icon-btn"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            type="button"
            className="icon-btn nav-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="nav-drawer">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

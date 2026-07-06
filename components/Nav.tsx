"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/",         label: "Home" },
  { href: "/about",    label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/contact",  label: "Contact" },
];

export default function Nav() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname              = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      <div className="grid grid-cols-[auto_1fr] items-center h-24 w-full">
        {/* Brand — reserves its own column, can never overlap the nav/hamburger column */}
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 pl-6">
          <Image
            src="/assets/logo/WhiteSandsLogo_clear.gif"
            alt="White Sands Construction"
            width={96}
            height={96}
            unoptimized
            className="shrink-0"
          />
          <span className="inline-block font-heading font-black uppercase tracking-widest text-primary leading-tight truncate text-sm max-w-[150px] min-[480px]:max-w-[235px] sm:text-base sm:max-w-none xl:text-xl">
            White Sands Construction, Inc.
          </span>
        </Link>

        {/* Desktop links + mobile hamburger — stay in centered container, untouched */}
        <div className="max-w-6xl mx-auto w-full px-6 flex items-center justify-end min-w-0">
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main navigation">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-heading font-semibold text-[0.72rem] uppercase tracking-widest px-3 py-2 rounded transition-colors duration-150 ${
                  isActive(href)
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-3 font-heading font-semibold text-[0.72rem] uppercase tracking-widest bg-accent text-dark px-5 py-2.5 rounded-full transition-colors duration-150 hover:bg-amber-500"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden p-2 text-gray-700 cursor-pointer shrink-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="flex flex-col py-4" aria-label="Mobile navigation">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-heading font-semibold text-sm uppercase tracking-widest px-6 py-4 transition-colors ${
                  isActive(href) ? "text-primary" : "text-gray-700"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="px-6 pt-2 pb-4">
              <Link
                href="/contact"
                className="block w-full text-center font-heading font-semibold text-sm uppercase tracking-widest bg-accent text-dark px-5 py-3 rounded-full"
              >
                Get a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

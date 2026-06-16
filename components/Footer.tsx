import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <Image
            src="/assets/logo/WhiteSandsLogo_clear.gif"
            alt="White Sands Construction"
            width={88}
            height={88}
            unoptimized
            className="mb-4 opacity-90"
          />
          <p className="font-heading font-bold text-xs uppercase tracking-widest text-gray-500 mb-2">
            Quality Construction Since 1988
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Licensed General Contractor<br />State of Hawaii<br />License #BC-22710
          </p>
        </div>

        {/* Contact */}
        <div>
          <p className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-5">
            Contact Us
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={16} className="text-primary mt-0.5 shrink-0" />
              <a href="tel:+18088809400" className="text-accent hover:opacity-75 transition-opacity">
                (808) 880-9400
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="text-primary mt-0.5 shrink-0" />
              <a href="mailto:olivia@whitesandsconst.com" className="text-accent hover:opacity-75 transition-opacity">
                olivia@whitesandsconst.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <span className="text-gray-500 leading-relaxed">
                61-3270 Maluokalani St.<br />Kamuela, HI 96743
              </span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <p className="font-heading font-bold text-xs uppercase tracking-widest text-white mb-5">
            Quick Links
          </p>
          <ul className="space-y-2.5 text-sm">
            {[
              { href: "/",         label: "Home" },
              { href: "/about",    label: "About" },
              { href: "/services", label: "Services" },
              { href: "/gallery",  label: "Gallery" },
              { href: "/contact",  label: "Contact" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="text-gray-500 hover:text-accent transition-colors duration-150">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} White Sands Construction, Inc. All rights reserved.
      </div>
    </footer>
  );
}

import { MapPin } from "lucide-react";

const ADDRESS = "61-3270 Maluokalani St, Kamuela, HI 96743";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

export default function LocationMap() {
  return (
    <section className="pt-8 pb-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-heading font-black text-3xl uppercase tracking-wide mb-3">
          Find Us
        </h2>
        <div className="w-14 h-1 bg-accent mb-10" />

        <div className="rounded overflow-hidden shadow-md">
          <iframe
            src={MAP_EMBED_SRC}
            className="w-full h-[320px] md:h-[420px] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="White Sands Construction location map"
          />
        </div>

        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 font-heading font-bold text-sm uppercase tracking-widest text-primary hover:underline"
        >
          <MapPin size={18} strokeWidth={1.5} />
          Get Directions
        </a>
      </div>
    </section>
  );
}

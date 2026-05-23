const stats = [
  { label: "Est. Year",          value: "1988" },
  { label: "Crew Members",       value: "20+"  },
  { label: "Big Island, Hawaii", value: "HI"   },
];

export default function StatsBar() {
  return (
    <section className="bg-primary py-10" aria-label="Company statistics">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
        {stats.map(({ label, value }) => (
          <div key={label} className="text-center text-white py-4 sm:py-0 sm:px-8">
            <div className="font-heading font-black text-4xl md:text-5xl leading-none mb-2">
              {value}
            </div>
            <div className="font-heading font-semibold text-xs uppercase tracking-widest opacity-70">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

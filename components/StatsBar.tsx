"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(v) { el.textContent = Math.round(v) + suffix; },
    });
    return controls.stop;
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { label: "Est. Year",        display: null, value: 1988, suffix: "" },
  { label: "Crew Members",     display: null, value: 20,   suffix: "+" },
  { label: "Big Island, Hawaii", display: "HI", value: null, suffix: "" },
];

export default function StatsBar() {
  return (
    <section className="bg-primary py-10" aria-label="Company statistics">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
        {stats.map(({ label, display, value, suffix }) => (
          <div key={label} className="text-center text-white py-4 sm:py-0 sm:px-8">
            <div className="font-heading font-black text-4xl md:text-5xl leading-none mb-2">
              {display ?? <AnimatedNumber value={value!} suffix={suffix} />}
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

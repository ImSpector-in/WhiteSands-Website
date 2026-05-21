"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "1988",       label: "Year Founded",        detail: "Over three decades building Hawaii" },
  { value: "20+",        label: "Crew Members",         detail: "Full-time in-house specialists" },
  { value: "35+",        label: "Years Experience",     detail: "Trusted across the Hawaiian Islands" },
  { value: "Big Island", label: "Hawaii",               detail: "Locally rooted, island-wide reach" },
];

export default function HomeIntro() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl tracking-tight text-dark mb-5">
            Building Hawaii<br />Since 1988.
          </h2>
          <div className="w-12 h-0.5 bg-accent mb-6" />
          <p className="text-gray-500 text-base md:text-lg leading-relaxed">
            White Sands Construction brings over 35 years of craftsmanship to every project,
            from custom homes on the Big Island to landmark hotel renovations across the Hawaiian Islands.
          </p>
        </motion.div>

        {/* Right — stats */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
          {stats.map(({ value, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="font-heading font-black text-4xl md:text-5xl text-primary leading-none mb-1">
                {value}
              </div>
              <div className="font-heading font-bold text-xs uppercase tracking-widest text-dark mb-1">
                {label}
              </div>
              <div className="text-gray-400 text-sm leading-snug">{detail}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

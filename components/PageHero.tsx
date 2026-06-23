"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  bgImage: string;
}

export default function PageHero({ title, subtitle, bgImage }: PageHeroProps) {
  return (
    <section
      className="relative h-80 md:h-96 flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 text-center text-white px-6">
        <motion.h1
          className="font-heading font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-wide"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="mt-3 text-lg font-light opacity-85"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}

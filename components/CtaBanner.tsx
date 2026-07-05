"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
}

export default function CtaBanner({
  title   = "Ready to Build? Let's Talk.",
  subtitle = "Contact us today to discuss your next project.",
}: CtaBannerProps) {
  return (
    <section className="bg-accent py-20 text-center px-6">
      <motion.h2
        className="font-heading font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide text-dark mb-3"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-reveal
      >
        {title}
      </motion.h2>
      <motion.p
        className="text-dark/70 text-base mb-8"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        data-reveal
        data-reveal-delay="150"
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        data-reveal
        data-reveal-delay="250"
      >
        <Link
          href="/contact"
          className="inline-block font-heading font-bold text-sm uppercase tracking-widest bg-primary text-white px-8 py-4 rounded transition-colors duration-200 hover:bg-blue-800"
        >
          Get a Free Quote
        </Link>
      </motion.div>
    </section>
  );
}

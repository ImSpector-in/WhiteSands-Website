"use client";

import { Metadata } from "next";
import PageHero  from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import { motion } from "framer-motion";
import { Home, Building2, Star, UtensilsCrossed, Layers, Hammer } from "lucide-react";

const services = [
  {
    icon:  Home,
    title: "Custom Home Construction",
    desc:  "From ground-up custom builds to major additions, we bring your residential vision to life with the craftsmanship Hawaii homeowners expect. Every detail, inside and out.",
  },
  {
    icon:  Building2,
    title: "Commercial Construction",
    desc:  "Large-scale commercial builds, tenant improvements, and ground-up commercial development. We work with architects and developers to deliver on time and on budget.",
  },
  {
    icon:  Star,
    title: "Hotel & Resort Remodeling",
    desc:  "Extensive experience renovating Hawaii's premier properties — Fairmont Orchid, Mauna Kea Beach Hotel, Hawaii Prince Waikiki, and more. We understand the unique demands of occupied hotel renovation.",
  },
  {
    icon:  UtensilsCrossed,
    title: "Restaurant & Hospitality Fit-Out",
    desc:  "High-quality restaurant interiors built to exacting standards. Our work includes Ruth's Chris Steakhouse locations and Sheraton food & beverage outlets across the Islands.",
  },
  {
    icon:  Layers,
    title: "Concrete & Masonry",
    desc:  "In-house concrete finishers for foundations, flatwork, retaining walls, and decorative concrete applications. Precise, durable, and built for Hawaii's conditions.",
  },
  {
    icon:  Hammer,
    title: "Carpentry & Finish Work",
    desc:  "Journeymen and apprentice carpenters delivering precision framing, millwork, cabinetry, and finish details that elevate every project from good to exceptional.",
  },
];

// Services page uses client component for animations
// Metadata is exported from a separate server segment if needed — for now page is client
export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Full-service general contracting across the Hawaiian Islands"
        bgImage="/assets/images/Hawaii%20Prince%20Waikiki/3.jpg"
      />

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wide mb-3">
              What We Do
            </h2>
            <div className="w-14 h-1 bg-accent mb-5" />
            <p className="text-gray-500 max-w-xl leading-relaxed">
              White Sands employs in-house painters, heavy equipment operators, concrete finishers, and journeymen carpenters — giving us the depth to handle complex projects without heavy reliance on subcontractors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="bg-gray-50 rounded p-8"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Icon size={44} className="text-primary mb-5" strokeWidth={1.3} />
                <h3 className="font-heading font-bold text-sm uppercase tracking-wide mb-3">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a Project in Mind?"
        subtitle="Tell us what you're building and we'll put together a proposal."
      />
    </>
  );
}

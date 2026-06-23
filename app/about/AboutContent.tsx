"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Paintbrush, Truck, Building, Hammer } from "lucide-react";

const whyItems = [
  {
    icon: Paintbrush,
    title: "In-House Painters",
    desc:  "Our full-time painting crew means tighter quality control and no scheduling delays waiting on subcontractors.",
  },
  {
    icon: Truck,
    title: "Heavy Equipment Operators",
    desc:  "We own and operate our own heavy equipment, cutting costs and keeping your project on schedule.",
  },
  {
    icon: Building,
    title: "Concrete Finishers",
    desc:  "Expert concrete work from foundation to finish — structural, decorative, and everything in between.",
  },
  {
    icon: Hammer,
    title: "Journeymen Carpenters",
    desc:  "Experienced journeymen and apprentices deliver the finish carpentry quality that premium clients expect.",
  },
];

export default function AboutContent() {
  return (
    <>
      {/* Story section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wide mb-3">
              Our Story
            </h2>
            <div className="w-14 h-1 bg-accent mb-8" />
            <p className="text-gray-500 leading-relaxed mb-5">
              White Sands Construction Inc. has built a broad base of experience in the General Construction Business. The company started in 1988 employing just a handful of employees — and a commitment to doing the work right.
            </p>
            <p className="text-gray-500 leading-relaxed mb-5">
              Today, White Sands Construction Inc. has a crew of twenty-plus employees available to build your custom home or commercial project. Our growth has come through the reputation we&apos;ve earned in the community, one project at a time.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              White Sands Construction is focused on continuing that growth through the relationships we build — with clients, architects, and the communities across the Islands we&apos;re proud to call home.
            </p>
            <Link
              href="/contact"
              className="inline-block font-heading font-bold text-xs uppercase tracking-widest bg-primary text-white px-7 py-3.5 rounded transition-colors duration-200 hover:bg-blue-800"
            >
              Start a Conversation
            </Link>
          </motion.div>

          <motion.div
            className="aspect-[4/3] rounded overflow-hidden"
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%204.jpg"
              alt="Prince Waikiki 100 Sails project by White Sands Construction"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wide mb-3">
              Why Choose White Sands
            </h2>
            <div className="w-14 h-1 bg-accent mb-5" />
            <p className="text-gray-500 max-w-lg leading-relaxed">
              We bring more than tools to the job site — we bring a full crew of in-house specialists who take pride in every detail.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {whyItems.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="flex gap-5"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Icon size={32} className="text-primary shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase tracking-wide mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

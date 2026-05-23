import { Metadata } from "next";
import PageHero     from "@/components/PageHero";
import ContactForm  from "@/components/contact/ContactForm";
import { Phone, Mail, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | White Sands Construction",
  description:
    "Contact White Sands Construction — Call (808) 880-9400 or send a message to get a free quote on your next Hawaii construction project.",
};

const contactInfo = [
  {
    icon:  Phone,
    label: "Phone",
    lines: [
      <a key="phone" href="tel:+18088809400" className="text-primary hover:underline">(808) 880-9400</a>,
      <span key="fax" className="text-xs text-gray-400">Fax: (808) 880-9600</span>,
    ],
  },
  {
    icon:  Mail,
    label: "Email",
    lines: [
      <a key="email" href="mailto:olivia@whitesandsconst.com" className="text-primary hover:underline">olivia@whitesandsconst.com</a>,
      <span key="name" className="text-xs text-gray-400">Olivia Culp, Office Manager</span>,
    ],
  },
  {
    icon:  MapPin,
    label: "Physical Address",
    lines: [
      <span key="addr">61-3270 Maluokalani St.<br />Kamuela, HI 96743</span>,
      <span key="note" className="text-xs text-gray-400 italic">For FedEx / UPS deliveries</span>,
    ],
  },
  {
    icon:  Package,
    label: "Mailing Address (USPS)",
    lines: [
      <span key="mail">59-318 Kanaloa Drive<br />Kamuela, HI 96743</span>,
    ],
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Let's talk about your next project"
        bgImage="/assets/images/new%20pictures/KohalaSide.jpg"
      />

      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <h2 className="font-heading font-black text-3xl uppercase tracking-wide mb-3">
              Get In Touch
            </h2>
            <div className="w-14 h-1 bg-accent mb-10" />

            <ul className="space-y-8">
              {contactInfo.map(({ icon: Icon, label, lines }) => (
                <li key={label} className="flex gap-4">
                  <Icon size={24} className="text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="font-heading font-bold text-xs uppercase tracking-widest text-primary mb-1">
                      {label}
                    </p>
                    <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">
                      {lines.map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}

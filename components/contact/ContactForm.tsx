"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      // Submits to RSForm!Pro in Joomla. Replace RSFORM_ID with the form's ID
      // (Joomla admin → RSForm!Pro → the form). Joomla handles the email via SMTP.
      const res = await fetch("/index.php?option=com_rsform&task=submissions.submit&formId=RSFORM_ID", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded p-8 text-center">
        <p className="font-heading font-bold text-green-800 text-lg uppercase tracking-wide mb-2">
          Message Sent!
        </p>
        <p className="text-green-700 text-sm">
          Thank you — we&apos;ll be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded p-8 md:p-10">
      <h3 className="font-heading font-black text-lg uppercase tracking-wide mb-8">
        Send Us a Message
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label htmlFor="name" className="block font-heading font-bold text-[0.68rem] uppercase tracking-widest text-gray-500 mb-1.5">
            Full Name <span aria-hidden>*</span>
          </label>
          <input
            id="name" name="name" type="text" required
            placeholder="John Smith"
            className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition min-h-[44px]"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-heading font-bold text-[0.68rem] uppercase tracking-widest text-gray-500 mb-1.5">
            Phone Number
          </label>
          <input
            id="phone" name="phone" type="tel"
            placeholder="(808) 555-0100"
            className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition min-h-[44px]"
          />
        </div>
      </div>

      <div className="mb-5">
        <label htmlFor="email" className="block font-heading font-bold text-[0.68rem] uppercase tracking-widest text-gray-500 mb-1.5">
          Email Address <span aria-hidden>*</span>
        </label>
        <input
          id="email" name="email" type="email" required
          placeholder="you@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition min-h-[44px]"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="project" className="block font-heading font-bold text-[0.68rem] uppercase tracking-widest text-gray-500 mb-1.5">
          Project Type
        </label>
        <select
          id="project" name="project"
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition min-h-[44px] bg-white"
        >
          <option value="">Select a service...</option>
          <option value="custom-home">Custom Home Construction</option>
          <option value="healthcare">Healthcare Facilities</option>
          <option value="hotel-resort">Hotel &amp; Resort Remodeling</option>
          <option value="restaurant">Restaurant &amp; Hospitality Fit-Out</option>
          <option value="concrete">Concrete &amp; Masonry</option>
          <option value="carpentry">Carpentry &amp; Finish Work</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-7">
        <label htmlFor="message" className="block font-heading font-bold text-[0.68rem] uppercase tracking-widest text-gray-500 mb-1.5">
          Message <span aria-hidden>*</span>
        </label>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Tell us about your project — location, scope, timeline, and any other details."
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-y"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm mb-4">
          Something went wrong — please try again or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full font-heading font-bold text-sm uppercase tracking-widest bg-primary text-white py-4 rounded transition-colors duration-200 hover:bg-blue-800 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">
        We typically respond within one business day.
      </p>
    </form>
  );
}

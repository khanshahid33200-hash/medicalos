"use client";

import { useState } from "react";
import ContactHero from "./ContactHero";
import ContactOptions from "./ContactOptions";
import ContactForm from "./ContactForm";
import AICommunication from "./AICommunication";
import WhyContactSection from "./WhyContactSection";
import ContactFAQ from "./ContactFAQ";
import ContactCTA from "./ContactCTA";

export default function ContactPageContent() {
  const [selectedSubject, setSelectedSubject] = useState<string>(
    "Product & Platform Demonstration"
  );

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-[#F7F8FC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Subtle top ambient gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-[350px] w-[350px] sm:h-[600px] sm:w-[600px] rounded-full bg-blue-300/15 blur-[100px] sm:blur-[160px]" />
        <div className="absolute right-[-10%] top-[25%] h-[350px] w-[350px] sm:h-[600px] sm:w-[600px] rounded-full bg-orange-300/12 blur-[100px] sm:blur-[160px]" />
        <div className="absolute left-[20%] bottom-[10%] h-[350px] w-[350px] sm:h-[600px] sm:w-[600px] rounded-full bg-violet-300/15 blur-[100px] sm:blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        {/* Section 01: Hero with 3D Scene */}
        <ContactHero />

        {/* Section 02: Contact Options */}
        <ContactOptions onSelectOption={setSelectedSubject} />

        {/* Section 03: Main Contact Area (Form + Connect Info) */}
        <ContactForm selectedSubject={selectedSubject} />

        {/* Section 04: AI Communication Showcase */}
        <AICommunication />

        {/* Section 05: Why Contact MedTech Fixaters */}
        <WhyContactSection />

        {/* Section 06: Frequently Asked Questions */}
        <ContactFAQ />

        {/* Section 07: Final CTA */}
        <ContactCTA />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { EnquirySection } from '../sections/home/EnquirySection';
import { Container } from '../components/Container';
import { ArrowLeft, Sparkles, HelpCircle, Phone, MapPin, Clock } from 'lucide-react';

export const EnquiryPage: React.FC = () => {
  return (
    <div className="w-full bg-[#180617] text-ivory min-h-screen flex flex-col">
      {/* ─── Hero Header ─── */}
      <section className="relative py-16 sm:py-24 bg-plum-950 border-b border-gold-500/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A0725]/80 via-transparent to-[#180617] pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 max-w-5xl text-center space-y-4">
          <div className="flex justify-center mb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-300 hover:text-gold-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Home</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-300 text-xs font-mono font-medium tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Admissions &amp; Consultation Desk</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 font-normal tracking-tight">
            Institutional Enquiry Portal
          </h1>

          <p className="text-sm sm:text-base text-ivory/80 font-sans font-light max-w-2xl mx-auto leading-relaxed">
            Every submission is logged directly into our central institute database. Connect with our senior teachers for TTC certification, corporate workshops, or daily shala practice.
          </p>
        </Container>
      </section>

      {/* ─── Main Database Enquiry Section ─── */}
      <main className="flex-1">
        <EnquirySection
          id="portal-enquiry-form"
          className="border-t-0"
          title="Send Your Query Directly to Admissions"
          subtitle="Fill in your details below. Your request will be immediately stored in our database for prompt advisor follow-up."
        />

        {/* FAQ & Verification strip */}
        <section className="py-16 bg-[#130412] border-t border-gold-500/20 text-ivory/80 text-xs">
          <Container className="max-w-6xl">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
              <div className="flex items-center justify-center gap-1.5 text-gold-400 font-mono uppercase text-[11px] font-semibold">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="font-editorial text-2xl text-gold-100">
                Frequently Asked Inquiries
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-plum-950/60 border border-gold-500/20 space-y-2.5">
                <h4 className="font-semibold text-sm text-gold-200">
                  How soon will I receive a reply?
                </h4>
                <p className="text-ivory/70 leading-relaxed font-sans">
                  Our admissions coordinators review the database continuously. You will receive a direct call or WhatsApp update within 24 working hours.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-plum-950/60 border border-gold-500/20 space-y-2.5">
                <h4 className="font-semibold text-sm text-gold-200">
                  Can beginners join certified TTC?
                </h4>
                <p className="text-ivory/70 leading-relaxed font-sans">
                  Yes, we offer foundational modules that progressively prepare dedicated seekers for internationally recognized teacher certifications.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-plum-950/60 border border-gold-500/20 space-y-2.5">
                <h4 className="font-semibold text-sm text-gold-200">
                  Are both online &amp; studio classes available?
                </h4>
                <p className="text-ivory/70 leading-relaxed font-sans">
                  We host interactive live hybrid streams as well as in-person traditional sadhana at our Sector 89 Faridabad shala.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
};

export default EnquiryPage;

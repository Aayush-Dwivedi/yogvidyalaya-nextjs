'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { OrnamentalDivider } from './Motifs';
import { useToast } from './Toast';
import { CmsService } from '../services/cmsService';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const [contact, setContact] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('kalptaru_cached_institute');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.contact) return parsed.contact;
        }
      } catch {}
    }
    return {
      email: 'shuchimohan@kalptaruyogvidyalaya.com',
      phone: '09818047984',
      whatsappLink: 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL',
      address: {
        street: 'N114 Piyush Heights, Sector 89',
        city: 'Faridabad',
        postalCode: '121002',
      },
    };
  });

  const loadContact = async () => {
    try {
      const data = await CmsService.getInstitute();
      if (data && data.contact) {
        setContact(data.contact);
      }
    } catch {}
  };

  useEffect(() => {
    loadContact();
    const handleUpdate = () => loadContact();
    window.addEventListener('kalptaru-cms-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('kalptaru-cms-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address to receive our discourses.',
      });
      return;
    }

    toast({
      type: 'gold',
      title: 'Namaste & Welcome',
      message: 'You are now subscribed to the Kalptaruu Yoga Vidhyalaya monthly journal.',
    });
    setEmail('');
  };

  return (
    <footer className="bg-plum-950 text-ivory/90 border-t border-gold-500/30 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12">
          {/* Column 1: Institute Brand Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <img
                src="/logo.png"
                alt="Kalptaruu Yoga Vidhyalaya Logo"
                className="w-12 h-12 rounded-full object-cover shadow-soft group-hover:scale-[1.04] transition-transform shrink-0"
              />
              <div className="flex flex-col">
                <span className="font-editorial text-xl text-ivory tracking-wide font-normal">
                  Kalptaruu Yoga Vidhyalaya
                </span>
                <span className="text-[9px] uppercase tracking-widest-editorial text-gold-400 font-semibold">
                  Traditional Yoga &amp; Wellness
                </span>
              </div>
            </Link>

            <p className="text-xs text-ivory/70 leading-relaxed font-sans max-w-sm">
              Dedicated to authentic yogic science and holistic wellness. Experience traditional yoga practices for modern living.
            </p>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs uppercase tracking-widest-editorial text-gold-400 font-semibold block">
              Quick Links
            </span>
            <ul className="space-y-2 text-xs text-ivory/80">
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/founder" className="hover:text-gold-300 transition-colors">
                  Our Founder
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-gold-300 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/trainers" className="hover:text-gold-300 transition-colors">
                  Our Trainers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest-editorial text-gold-400 font-semibold block">
              Contact Us
            </span>
            <div className="space-y-2 text-xs text-ivory/80 font-sans">
              <div>
                <span className="text-gold-400 font-medium">Phone: </span>
                <a href={`tel:${contact.phone || '09818047984'}`} className="text-ivory hover:text-gold-300 transition-colors font-mono">
                  {contact.phone || '09818047984'}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gold-400 font-medium">WhatsApp: </span>
                <a
                  href={contact.whatsappLink || 'https://chat.whatsapp.com/Id76gIzYYla6945X3lKjzL'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory hover:text-gold-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="w-4 h-4 rounded-full bg-ivory flex items-center justify-center p-0.5 inline-flex">
                    <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-full h-full object-contain" />
                  </span>
                  <span>Join Community Group</span>
                </a>
              </div>
              <div>
                <span className="text-gold-400 font-medium">Email: </span>
                <a href={`mailto:${contact.email || 'shuchimohan@kalptaruyogvidyalaya.com'}`} className="text-ivory hover:text-gold-300 transition-colors">
                  {contact.email || 'shuchimohan@kalptaruyogvidyalaya.com'}
                </a>
              </div>
              <div>
                <span className="text-gold-400 font-medium">Address: </span>
                <span className="text-ivory/90">
                  {contact.address?.street
                    ? `${contact.address.street}, ${contact.address.city || 'Faridabad'}${contact.address.postalCode ? ` \u2013 ${contact.address.postalCode}` : ''}`
                    : 'N114 Piyush Heights, Sector 89, Faridabad \u2013 121002'}
                </span>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-plum-900/80 border border-gold-500/40 text-ivory placeholder:text-ivory/40 text-xs px-3 py-2 rounded-l-[2px] focus:outline-none focus:border-gold-400"
                />
                <button
                  type="submit"
                  className="bg-gold-500 text-plum-950 font-medium text-xs px-3.5 py-2 rounded-r-[2px] hover:bg-gold-400 transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Ornamental Divider */}
        <OrnamentalDivider className="my-6 opacity-40" />

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivory/60 space-y-3 sm:space-y-0 pt-4">
          <p>
            &copy; {new Date().getFullYear()} Kalptaruu Yoga Vidhyalaya. All rights reserved.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="/privacy" className="hover:text-gold-300 transition-colors">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-gold-300 transition-colors">
              Terms of Study
            </Link>
            <span>&bull;</span>
            <Link href="/disclaimer" className="hover:text-gold-300 transition-colors">
              Medical Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

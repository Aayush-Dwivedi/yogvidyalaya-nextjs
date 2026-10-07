'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '../components/Container';
import { Badge } from '../components/Badge';
import { LinkButton } from '../components/LinkButton';
import { LoadingState } from '../components/LoadingState';
import { CornerFlourish, LotusMotif } from '../components/Motifs';
import { AuricBackground } from '../components/AuricBackground';
import { CmsService } from '../services/cmsService';
import { CmsMembershipPlan } from '../types/cms';
import {
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  ArrowRight,
  BookOpen,
  HeartHandshake,
  HelpCircle,
  ChevronDown,
  Star,
  Users,
  Compass,
} from 'lucide-react';

export const MembershipPage: React.FC = () => {
  const [plans, setPlans] = useState<CmsMembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await CmsService.getMembershipPlans('published');
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          // Graceful fallback to default institute plans
          setPlans([
            {
              title: 'Monthly Sadhana Pass',
              slug: 'monthly-sadhana-pass',
              billingCycle: 'monthly',
              price: { amount: 2500, currency: 'INR', discountPercentage: 16, originalAmount: 3000 },
              description: 'Ideal for regular practitioners seeking consistency in traditional morning or evening batches with master instructors.',
              batches: [
                { name: 'Morning Shala Batch', timing: '06:00 AM – 07:30 AM', days: 'Mon to Fri' },
                { name: 'Evening Dhyana Batch', timing: '06:30 PM – 08:00 PM', days: 'Mon to Fri' },
              ],
              features: [
                'Unlimited weekday practice access',
                'Full access to the Kalptaruu Yogic Library',
                'Monthly 1-on-1 alignment check-in with an Acharya',
                '10% discount on all intensive weekend workshops',
              ],
              popular: true,
              order: 1,
              status: 'published',
            },
            {
              title: 'Annual Shala Sadhaka Pass',
              slug: 'annual-shala-sadhaka-pass',
              billingCycle: 'annual',
              price: { amount: 24000, currency: 'INR', discountPercentage: 20, originalAmount: 30000 },
              description: 'Our most committed pathway for devoted sadhakas seeking lifelong transformation and priority community privileges.',
              batches: [
                { name: 'All Morning & Evening Batches', timing: 'Flexible Attendance', days: 'Mon to Sat' },
              ],
              features: [
                'Unlimited year-round shala access',
                'Complimentary entry to 2 Weekend Intensives of your choice',
                'Priority reservations for international retreats',
                'Personalized sadhana journal and consultation quarterly',
              ],
              popular: false,
              order: 2,
              status: 'published',
            },
          ]);
        }
      } catch (err) {
        console.warn('Could not load membership plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const cycles = ['all', 'monthly', 'quarterly', 'half-yearly', 'annual'];

  const filteredPlans = plans.filter((plan) => {
    if (selectedCycle === 'all') return true;
    return plan.billingCycle === selectedCycle;
  });

  const faqs = [
    {
      q: 'Can I switch between morning and evening batches?',
      a: 'Yes, our memberships offer flexible shala attendance. While we encourage maintaining a fixed circadian rhythm for deeper sadhana, members can attend either batch on weekdays by notifying the reception desk.',
    },
    {
      q: 'Are yoga mats and props provided at the Vidhyalaya?',
      a: 'The shala provides organic cotton and natural rubber mats, wooden blocks, cotton straps, and bolsters. Sadhakas are welcome to bring their own personal mat and store it in our locker alcoves.',
    },
    {
      q: 'Is prior yoga experience required to join?',
      a: 'No prior experience is necessary. Our batches are thoughtfully calibrated into foundational alignment and progressive postures, ensuring beginners receive gentle modifications while seasoned practitioners deepen their practice.',
    },
    {
      q: 'Can I pause my membership if I travel?',
      a: 'Annual and multi-month pass holders can pause their sadhana pass for up to 30 days once per billing year upon prior email notice.',
    },
  ];

  return (
    <div className="bg-canvas min-h-screen text-ink font-sans pb-24">
      {/* 1. Hero Section with Feelable Animated Auric Gradient */}
      <section className="relative py-20 sm:py-28 bg-plum-950 text-white overflow-hidden">
        <AuricBackground />

        <Container size="wide" className="relative z-10 text-center">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-center space-x-2 text-xs font-mono tracking-widest text-gold-400/80 uppercase mb-6">
            <Link href="/" className="hover:text-gold-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/programs/courses" className="hover:text-gold-300 transition-colors">
              Programs
            </Link>
            <span>/</span>
            <span className="text-white font-semibold">Membership</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-mono uppercase tracking-widest mb-6">
            <LotusMotif size={16} />
            <span>Daily Shala &amp; Ashram Passes</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-[#FFF5DB] to-gold-300 max-w-4xl mx-auto">
            Continuous Sadhana Memberships
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Step into a serene sanctuary of authentic classical Hatha, pranayama, and therapeutic alignment. Regular daily practice designed to cultivate enduring vitality and stillness.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12 pt-10 border-t border-plum-900/60">
            <div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-gold-400">6 Days</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">Weekly Shala Practice</p>
            </div>
            <div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-gold-400">2 Batches</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">Morning &amp; Evening</p>
            </div>
            <div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-gold-400">1-on-1</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">Alignment Mentorship</p>
            </div>
            <div>
              <p className="font-editorial text-2xl sm:text-3xl font-bold text-gold-400">MDNIY / IYA</p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mt-1">Certified Faculty</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Membership Plans Section */}
      <section className="py-20 sm:py-24 relative">
        <Container size="wide">
          {/* Cycle Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-[11px] font-mono text-gold-700 uppercase tracking-widest font-semibold block mb-1">
                Select Your Commitment
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold">
                Flexible Sadhana Tiers
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="inline-flex p-1 bg-surface-subtle border border-border rounded-xl">
              {cycles.map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`px-3 sm:px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-lg transition-all capitalize ${
                    selectedCycle === cycle
                      ? 'bg-plum-900 text-gold-400 font-semibold shadow-xs'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {cycle === 'all' ? 'All Passes' : cycle.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingState message="Loading sadhana membership passes..." />
          ) : filteredPlans.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-border">
              <p className="text-ink-muted text-sm font-sans">
                No active membership plans currently listed for this billing cycle.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {filteredPlans.map((plan) => {
                const planId = plan._id || plan.id || plan.slug;
                const isPopular = Boolean(plan.popular);

                return (
                  <div
                    key={planId}
                    className={`bg-white rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 ${
                      isPopular
                        ? 'border-gold-500 ring-2 ring-gold-500/20 shadow-md'
                        : 'border-border hover:border-plum-900/40'
                    }`}
                  >
                    {/* Popular ribbon */}
                    {isPopular && (
                      <div className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-plum-950 font-sans text-[11px] font-bold py-1.5 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Most Revered Pathway</span>
                      </div>
                    )}

                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                      {/* Plan Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2.5 py-1 rounded-md bg-canvas-warm text-gold-800 border border-gold-300/60">
                          {plan.billingCycle}
                        </span>
                        {plan.price.discountPercentage ? (
                          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Save {plan.price.discountPercentage}%
                          </span>
                        ) : null}
                      </div>

                      <h3 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold leading-tight">
                        {plan.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-ink-muted font-sans mt-3 leading-relaxed">
                        {plan.description}
                      </p>

                      {/* Pricing Display */}
                      <div className="mt-6 pt-6 border-t border-border flex items-baseline gap-2">
                        <span className="font-editorial text-4xl sm:text-5xl font-bold text-plum-950">
                          ₹{plan.price.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-ink-muted font-mono">
                          / {plan.billingCycle === 'monthly' ? 'month' : plan.billingCycle}
                        </span>
                        {plan.price.originalAmount && plan.price.originalAmount > plan.price.amount && (
                          <span className="text-xs text-ink-muted/70 line-through font-mono ml-1">
                            ₹{plan.price.originalAmount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Batches Preview */}
                      {plan.batches && plan.batches.length > 0 && (
                        <div className="mt-6 p-3.5 bg-canvas-warm/80 rounded-xl border border-border/70 space-y-2">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-gold-800 font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gold-600" />
                            <span>Included Shala Batches</span>
                          </p>
                          {plan.batches.map((b, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs text-ink">
                              <span className="font-medium text-[11px]">{b.name}</span>
                              <span className="text-[10px] font-mono text-ink-muted bg-white/70 px-1.5 py-0.5 rounded border border-border/40">
                                {b.timing}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Features List */}
                      <div className="mt-6 space-y-3 flex-1">
                        <p className="text-[11px] font-mono uppercase tracking-wider text-ink-muted font-semibold">
                          Membership Privileges
                        </p>
                        <ul className="space-y-2.5">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-ink leading-relaxed">
                              <div className="w-4 h-4 rounded-full bg-gold-500/15 text-gold-700 flex items-center justify-center shrink-0 mt-0.5 border border-gold-500/30">
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                              </div>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-8 pt-6 border-t border-border">
                        <Link
                          href={`/contact/enquiry?plan=${encodeURIComponent(plan.title)}&type=membership`}
                          className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-sans font-bold transition-all shadow-sm ${
                            isPopular
                              ? 'bg-gold-500 hover:bg-gold-400 text-plum-950 shadow-soft hover:scale-[1.02]'
                              : 'bg-plum-900 hover:bg-plum-800 text-gold-300 hover:text-white'
                          }`}
                        >
                          <span>Join Sadhana Pass</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* 3. Member Privileges & Ashram Discipline */}
      <section className="py-20 bg-surface-subtle border-y border-border">
        <Container size="wide">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-700 font-semibold block mb-2">
              The Ashram Privilege
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-plum-900 font-normal leading-tight">
              Why Practice Daily at Kalptaru
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted font-sans mt-3 leading-relaxed">
              Our shala is an authentic ecosystem dedicated to personal discipline, inner stillness, and lineage purity—free from commercial gym haste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-700 flex items-center justify-center mb-4 border border-gold-500/30">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-lg text-plum-900 font-bold mb-2">
                  Circadian Sanctuary
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Morning batches align with Brahma Muhurta and sunrise energy; evening batches calm the autonomic nervous system for deep restorative rest.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-700 flex items-center justify-center mb-4 border border-gold-500/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-lg text-plum-900 font-bold mb-2">
                  Therapeutic Safety
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Led with clinical physiotherapy supervision by Mrs. Shuchi Mohan. Every posture is adjusted to protect spinal health and joints.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-700 flex items-center justify-center mb-4 border border-gold-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-lg text-plum-900 font-bold mb-2">
                  Yogic Library Access
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Quiet study alcove stocked with sacred Vedic texts, Hatha Pradipika commentaries, anatomy encyclopedias, and sadhana journals.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-700 flex items-center justify-center mb-4 border border-gold-500/30">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-lg text-plum-900 font-bold mb-2">
                  Community Satsangs
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Invitation to monthly spiritual discourses, festive Havans, and chanting circles with earnest sadhakas and visiting yoga masters.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Frequently Asked Questions Accordion */}
      <section className="py-20">
        <Container size="narrow">
          <div className="text-center mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-gold-700 font-semibold block mb-2">
              Common Enquiries
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold">
              Membership Guidelines &amp; FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-border overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-editorial text-base sm:text-lg text-plum-900 font-medium">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gold-600 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-ink-muted font-sans leading-relaxed border-t border-border/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Final Institutional CTA */}
      <section className="mt-12">
        <Container size="wide">
          <div className="bg-[#1C0D1B] rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden border border-gold-500/30 shadow-modal">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20">
                Begin Your Journey
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal leading-tight">
                Experience a Complimentary Trial Sadhana
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                Unsure which batch suits your body alignment? Visit the Vidhyalaya for an introductory assessment session with our lead instructor.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/contact/enquiry?type=membership_trial"
                  className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-plum-950 font-bold text-xs rounded-xl shadow-soft hover:scale-[1.02] transition-all"
                >
                  Book Assessment Trial
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-plum-900/80 hover:bg-plum-900 text-gold-300 hover:text-white border border-gold-500/30 text-xs font-semibold rounded-xl transition-colors"
                >
                  Visit the Shala
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default MembershipPage;

'use client';

import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Container,
  SectionHeader,
  Badge,
  Divider,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Image,
  Input,
  Select,
  Textarea,
  Modal,
  useToast,
  LoadingState,
  Skeleton,
  EmptyState,
  KalptaruTree,
  LotusMotif,
  SacredCircle,
  CornerFlourish,
} from './index';

export const DesignSystemShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'colors' | 'typography' | 'buttons' | 'cards' | 'forms'>('all');
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-canvas text-charcoal pb-24 selection:bg-plum-900 selection:text-gold-200">
      {/* Editorial Top Bar */}
      <div className="bg-plum-900 text-gold-200 border-b border-plum-950 py-3 px-4 sm:px-8">
        <Container size="wide" clean className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <KalptaruTree size={28} className="text-gold-400" />
            <span className="font-editorial text-lg tracking-wide text-ivory">
              Kalptaruu Yoga Vidhyalaya
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="dark" size="sm">Phase 2: Design System</Badge>
          </div>
        </Container>
      </div>

      {/* Hero / Header Section */}
      <section className="relative py-14 sm:py-20 border-b border-border/80 bg-canvas-warm overflow-hidden">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none hidden md:block">
          <SacredCircle size={280} />
        </div>
        <Container size="wide">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest-editorial text-gold-600 font-semibold mb-2 block">
              Design Philosophy & Visual Language
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-normal text-plum-900 leading-[1.1] mb-5">
              The Architecture of Stillness & Wisdom
            </h1>
            <p className="text-base sm:text-lg text-ink-muted leading-relaxed font-sans font-light max-w-2xl">
              Rooted in the sacred symbolism of the Kalptaru logo, combining deep plum purple, antique gold, and warm ivory into an intentional, timeless editorial canvas for yoga education.
            </p>

            {/* Quick Filter Navigation */}
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/60 text-xs">
              {(['all', 'colors', 'typography', 'buttons', 'cards', 'forms'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 uppercase tracking-wide-editorial rounded-[2px] transition-colors font-medium ${
                    activeTab === tab
                      ? 'bg-plum-900 text-gold-200 shadow-soft'
                      : 'bg-surface text-ink-muted border border-border hover:border-gold-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Showcase */}
      <Container size="wide" className="mt-16 space-y-24">
        {/* 1. COLOR TOKENS SYSTEM */}
        {(activeTab === 'all' || activeTab === 'colors') && (
          <section id="colors" className="space-y-8">
            <SectionHeader
              eyebrow="Color Architecture"
              title="Semantic Brand Tokens"
              description="A calibrated palette drawn from the Kalptaruu emblem. Pure blacks and neon accents are replaced with nuanced plum, antique gold, and warm ivory neutrals."
              align="asymmetric"
              motif={<KalptaruTree size={32} />}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div className="space-y-1.5">
                <div className="h-20 bg-plum-900 rounded-[2px] shadow-soft border border-plum-950 flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-gold-200">#2A1128</span>
                </div>
                <div className="text-xs font-medium text-plum-900">Royal Plum</div>
                <div className="text-[11px] text-ink-faint">Primary Brand</div>
              </div>

              <div className="space-y-1.5">
                <div className="h-20 bg-plum-800 rounded-[2px] shadow-soft border border-plum-900 flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-gold-200">#3B1838</span>
                </div>
                <div className="text-xs font-medium text-plum-900">Deep Plum</div>
                <div className="text-[11px] text-ink-faint">Surfaces / Focus</div>
              </div>

              <div className="space-y-1.5">
                <div className="h-20 bg-gold-500 rounded-[2px] shadow-soft border border-gold-600 flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-plum-950">#C5A059</span>
                </div>
                <div className="text-xs font-medium text-plum-900">Antique Gold</div>
                <div className="text-[11px] text-ink-faint">Primary Accent</div>
              </div>

              <div className="space-y-1.5">
                <div className="h-20 bg-gold-300 rounded-[2px] shadow-soft border border-gold-400 flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-plum-950">#E1C48C</span>
                </div>
                <div className="text-xs font-medium text-plum-900">Light Ochre</div>
                <div className="text-[11px] text-ink-faint">Gold Highlights</div>
              </div>

              <div className="space-y-1.5">
                <div className="h-20 bg-canvas-warm rounded-[2px] border border-border flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-charcoal">#FAF7F0</span>
                </div>
                <div className="text-xs font-medium text-plum-900">Warm Ivory</div>
                <div className="text-[11px] text-ink-faint">Page Canvas</div>
              </div>

              <div className="space-y-1.5">
                <div className="h-20 bg-earth-600 rounded-[2px] shadow-soft border border-earth-700 flex items-end p-2.5">
                  <span className="text-[11px] font-mono text-ivory">#7B4E3D</span>
                </div>
                <div className="text-xs font-medium text-plum-900">Muted Terracotta</div>
                <div className="text-[11px] text-ink-faint">Earth Balance</div>
              </div>
            </div>
          </section>
        )}

        {/* 2. TYPOGRAPHY SYSTEM */}
        {(activeTab === 'all' || activeTab === 'typography') && (
          <section id="typography" className="space-y-8">
            <SectionHeader
              eyebrow="Editorial Typography"
              title="Scale & Contrast"
              description="Pairing Cormorant Garamond serif for contemplative titles with Plus Jakarta Sans for pristine reading clarity."
              align="left"
            />

            <div className="bg-surface border border-border p-8 rounded-[2px] space-y-8">
              <div className="border-b border-border/80 pb-6">
                <span className="text-[10px] uppercase font-mono text-gold-600 block mb-1">Display Serif / Cormorant Garamond</span>
                <p className="text-4xl sm:text-5xl font-editorial text-plum-900 font-normal leading-tight">
                  “Yoga is the stilling of the fluctuations of the mind.”
                </p>
                <span className="text-xs font-sans text-ink-muted italic mt-2 block">— Patanjali Yoga Sutras (1.2)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-mono text-gold-600 block">Hierarchy Demonstration</span>
                  <h3 className="text-2xl font-editorial text-plum-900">H3 Section Title (24px)</h3>
                  <h4 className="text-xl font-editorial text-plum-900">H4 Subsection Title (20px)</h4>
                  <p className="text-sm text-ink-muted leading-relaxed font-sans">
                    Body text uses 14px/16px Plus Jakarta Sans with comfortable leading (1.6) and warm charcoal ink. Never harsh black.
                  </p>
                </div>

                <div className="space-y-3 bg-canvas-warm p-5 border border-border rounded-[2px]">
                  <span className="text-[10px] uppercase font-mono text-gold-600 block">Editorial Eyebrows & Metadata</span>
                  <div className="text-xs uppercase tracking-widest-editorial text-gold-600 font-semibold">
                    Ancient Tradition &bull; Certified Curriculum
                  </div>
                  <div className="text-xs text-ink-muted font-sans flex items-center gap-3">
                    <span>Duration: 200 Hours</span>
                    <span>&bull;</span>
                    <span>Format: In-Person / Residential</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. BUTTONS & INTERACTIVE CONTROLS */}
        {(activeTab === 'all' || activeTab === 'buttons') && (
          <section id="buttons" className="space-y-8">
            <SectionHeader
              eyebrow="Interactive Elements"
              title="Button Architecture"
              description="Visually restrained button styles designed for calm authority rather than aggressive call-to-action clickbait."
              align="left"
            />

            <div className="bg-surface border border-border p-8 rounded-[2px] space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
                <Button variant="outline">Minimal Outline</Button>
                <Button variant="ghost">Subtle Ghost</Button>
                <Button variant="text">Editorial Link Button</Button>
              </div>

              <Divider variant="subtle" />

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs text-ink-muted w-24">Button Sizes:</span>
                <Button variant="primary" size="sm">Small (32px)</Button>
                <Button variant="primary" size="md">Medium (40px)</Button>
                <Button variant="primary" size="lg">Large (48px)</Button>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs text-ink-muted w-24">States:</span>
                <Button variant="primary" isLoading>Submitting</Button>
                <Button variant="secondary" disabled>Disabled State</Button>
                <div className="flex items-center gap-2">
                  <IconButton
                    variant="outline"
                    size="md"
                    aria-label="Refresh"
                    onClick={() => toast({ type: 'gold', title: 'Action Triggered', message: 'Icon button interacted with.' })}
                  >
                    <svg className="w-4 h-4 text-plum-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </IconButton>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. CARDS & EDITORIAL COMPOSITIONS */}
        {(activeTab === 'all' || activeTab === 'cards') && (
          <section id="cards" className="space-y-8">
            <SectionHeader
              eyebrow="Editorial Layouts"
              title="Restrained Card System"
              description="Differentiated compositions avoiding the three-identical-cards trap. Hairline borders, selective gold rules, and spacious typography."
              align="asymmetric"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Card 1: Default Surface Card */}
              <Card variant="default" hoverable>
                <CardHeader>
                  <Badge variant="plum" size="sm">Philosophy</Badge>
                  <CardTitle>Traditional Ashtanga</CardTitle>
                  <CardDescription>
                    Eight limbs of yogic discipline grounded in classical lineage and breath synchronization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-ink-muted font-sans">
                    Structured asana sequences designed to purify the nervous system and develop internal heat.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="text" size="sm">Explore Lineage</Button>
                </CardFooter>
              </Card>

              {/* Card 2: Editorial Top-Gold Rule Card */}
              <Card variant="editorial" hoverable>
                <div className="absolute top-2 right-2">
                  <CornerFlourish position="top-right" />
                </div>
                <CardHeader>
                  <Badge variant="gold" size="sm" dot>Signature Course</Badge>
                  <CardTitle>Pranayama & Kriya</CardTitle>
                  <CardDescription>
                    Breath control techniques to awaken subtle vital energies and calm the agitated intellect.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-canvas-warm p-3 border border-border/60 text-xs text-ink-muted space-y-1 rounded-[2px]">
                    <div>Schedule: 06:00 AM – 07:30 AM</div>
                    <div>Prerequisite: Basic Asana</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" size="sm">Syllabus Details</Button>
                </CardFooter>
              </Card>

              {/* Card 3: Deep Royal Plum Card */}
              <Card variant="plum">
                <CardHeader>
                  <Badge variant="dark" size="sm">Sanctuary</Badge>
                  <CardTitle className="text-gold-200">Residential Sadhana</CardTitle>
                  <CardDescription className="text-plum-100/80">
                    Immersion in peaceful ashram environments dedicated entirely to self-enquiry and meditation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-plum-100/70 font-sans">
                    Nutritious sattvic cuisine, daily satsang, silent periods, and teacher guidance.
                  </p>
                </CardContent>
                <CardFooter className="border-t border-plum-800">
                  <Button variant="secondary" size="sm" className="bg-transparent text-gold-200 border-gold-400">
                    Apply for Retreat
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>
        )}

        {/* 5. FORM ARCHITECTURE */}
        {(activeTab === 'all' || activeTab === 'forms') && (
          <section id="forms" className="space-y-8">
            <SectionHeader
              eyebrow="Form System"
              title="Accessible & Restrained Inputs"
              description="Clean ivory surfaces with subtle borders and antique gold focus indicators, designed for student enrollments and enquiries."
              align="left"
            />

            <div className="bg-surface border border-border p-8 rounded-[2px] max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Input
                  label="Full Name"
                  placeholder="e.g. Ananya Sharma"
                  helperText="Enter as per official identification"
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="ananya@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Select
                  label="Course of Interest"
                  options={[
                    { label: 'Select a program...', value: '' },
                    { label: '200-Hour Yoga Teacher Training', value: 'ytt-200' },
                    { label: 'Foundational Hatha Yoga Intensive', value: 'hatha-101' },
                    { label: 'Pranayama & Meditative Mastery', value: 'pranayama' },
                  ]}
                />

                <Input
                  label="Contact Number"
                  placeholder="+91 98765 43210"
                  error="Please provide a valid 10-digit number"
                />
              </div>

              <div className="mb-6">
                <Textarea
                  label="Spiritual Aspirations or Prior Experience"
                  placeholder="Share a brief note about your yogic journey and goals..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="ghost" size="sm">Clear Form</Button>
                <Button
                  variant="primary"
                  onClick={() => toast({ type: 'success', title: 'Form Validated', message: 'Input values processed cleanly.' })}
                >
                  Submit Enquiry
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* 6. MOTIFS & LINEWORK */}
        <section id="motifs" className="space-y-8">
          <SectionHeader
            eyebrow="Decorative Heritage"
            title="Subtle Indian Line Art & Motifs"
            description="Refined sacred geometry that evokes contemplation without turning the interface into an overwhelming decorative collage."
            align="left"
          />

          <div className="bg-surface border border-border p-8 rounded-[2px]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center text-center">
              <div className="p-4 bg-canvas-warm border border-border/60 rounded-[2px] flex flex-col items-center">
                <KalptaruTree size={54} />
                <span className="text-xs text-ink-muted mt-3 font-medium">Kalptaruu Tree</span>
              </div>

              <div className="p-4 bg-canvas-warm border border-border/60 rounded-[2px] flex flex-col items-center">
                <LotusMotif size={54} />
                <span className="text-xs text-ink-muted mt-3 font-medium">Lotus Blossom</span>
              </div>

              <div className="p-4 bg-canvas-warm border border-border/60 rounded-[2px] flex flex-col items-center">
                <SacredCircle size={54} />
                <span className="text-xs text-ink-muted mt-3 font-medium">Sacred Circle</span>
              </div>

              <div className="p-4 bg-canvas-warm border border-border/60 rounded-[2px] flex flex-col items-center">
                <div className="relative w-14 h-14 border border-border flex items-center justify-center">
                  <CornerFlourish position="top-left" className="absolute top-1 left-1" />
                  <CornerFlourish position="bottom-right" className="absolute bottom-1 right-1" />
                  <span className="text-[10px] text-gold-600 font-serif">Flourish</span>
                </div>
                <span className="text-xs text-ink-muted mt-3 font-medium">Corner Accent</span>
              </div>
            </div>

            <Divider variant="ornamental" />
          </div>
        </section>

        {/* 7. FEEDBACK & OVERLAYS (MODALS, TOASTS, EMPTY & LOADING) */}
        <section id="feedback" className="space-y-8">
          <SectionHeader
            eyebrow="Feedback & System States"
            title="Calm Overlays & Status Indicators"
            description="Accessible modals with light-dismiss, gentle toast alerts, animated breathing loaders, and empty states."
            align="asymmetric"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Modal & Toast Triggers */}
            <div className="bg-surface border border-border p-6 rounded-[2px] space-y-4">
              <h4 className="text-lg font-editorial text-plum-900">Overlays & Notifications</h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                Click below to trigger interactive dialogs and restrained notifications:
              </p>

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
                  Open Modal Dialog
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      type: 'gold',
                      title: 'Sadhana Session Booked',
                      message: 'Your morning practice reservation is confirmed.',
                    })
                  }
                >
                  Trigger Gold Toast
                </Button>

                <Button
                  variant="ghost"
                  onClick={() =>
                    toast({
                      type: 'error',
                      title: 'Action Requires Attention',
                      message: 'Please review highlighted form fields.',
                    })
                  }
                >
                  Trigger Error Toast
                </Button>
              </div>
            </div>

            {/* Loading, Skeleton & Empty States */}
            <div className="space-y-6">
              <div className="bg-surface border border-border p-6 rounded-[2px] space-y-4">
                <h4 className="text-lg font-editorial text-plum-900">Breathing Loader & Shimmer</h4>
                <LoadingState variant="tree" message="Centering mind and data..." />

                <div className="pt-4 border-t border-border space-y-2">
                  <span className="text-[10px] uppercase font-mono text-ink-faint block">Skeleton Shimmer Elements</span>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>

              {/* Photography Presentation */}
              <div className="bg-surface border border-border p-6 rounded-[2px]">
                <h4 className="text-lg font-editorial text-plum-900 mb-3">Editorial Photography</h4>
                <Image
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
                  alt="Meditation practice in sunlight"
                  aspectRatio="editorial"
                  bordered
                  caption="Morning Dhyana session under natural pavilion light."
                />
              </div>

              <EmptyState
                title="No Upcoming Workshops"
                description="New immersive retreats and weekend intensive dates will be announced shortly."
                action={<Button variant="outline" size="sm">Notify Me</Button>}
              />
            </div>
          </div>
        </section>
      </Container>

      {/* Interactive Modal Instance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Institute Admission Guidelines"
        description="Principles of respect, purity, and dedication at Kalptaruu Yoga Vidhyalaya."
      >
        <div className="space-y-3 font-sans text-xs text-ink-muted leading-relaxed">
          <p>
            1. Punctuality is observed as a meditative discipline. Students are requested to arrive 10 minutes prior to scheduled asana sessions.
          </p>
          <p>
            2. Simple, modest cotton attire is recommended to support breath flow and unrestricted movement.
          </p>
          <p>
            3. Digital devices remain silenced in sacred practice halls to protect the inner quietude of all practitioners.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
            I Understand
          </Button>
        </div>
      </Modal>

      {/* Editorial Footer */}
      <footer className="mt-24 pt-8 border-t border-border/80 text-center text-xs text-ink-muted">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-editorial text-plum-900 text-sm">
              Kalptaruu Yoga Vidhyalaya &bull; Design System Foundation
            </span>
            <span className="text-[11px] text-ink-faint">
              Traditional Yoga &amp; Wellness
            </span>
          </div>
        </Container>
      </footer>
    </div>
  );
};

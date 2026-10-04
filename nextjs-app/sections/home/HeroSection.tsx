'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HERO_SLIDES, HERO_METRICS } from '../../services/homeData';
import { LinkButton } from '../../components/LinkButton';
import { Container } from '../../components/Container';
import { cn } from '../../utils/cn';

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Auto-advance slides every 7 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative min-h-[600px] lg:min-h-[85vh] flex flex-col justify-between overflow-hidden bg-plum-950 text-ivory select-none focus:outline-none outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      aria-roledescription="carousel"
      aria-label="Kalptaru Yog Vidyalaya Highlights"
    >
      {/* Background Slides with Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((s, index) => (
          <div
            key={s.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            )}
            style={{ transitionProperty: 'opacity, transform' }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08]"
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            {/* Multi-layered Vignette & Brand Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-plum-950 via-plum-950/50 to-plum-950/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-plum-950/30 to-plum-950/80 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Hero Content Canvas */}
      <div className="relative z-10 flex-grow flex items-center py-8 sm:py-12 lg:py-16">
        <Container size="wide">
          <div className="max-w-3xl space-y-5 sm:space-y-6">
            {/* Subtitle / Eyebrow */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Kalptaru Emblem"
                className="w-7 h-7 rounded-full object-cover border border-gold-400/60 shadow-xs shrink-0"
              />
              <span className="w-8 h-px bg-gold-400" />
              <span className="text-xs uppercase tracking-widest-editorial text-gold-300 font-semibold">
                {slide.subtitle}
              </span>
            </div>

            {/* Institution Title & Affiliation */}
            <div>
              <span className="text-xs uppercase tracking-wide-editorial text-gold-200/80 block mb-1">
                Affiliated by Indian Yoga Association
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-white leading-[1.12] tracking-tight drop-shadow-sm">
                Kalptaru Yog Vidyalaya
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-sans font-light max-w-2xl">
              {slide.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
              <LinkButton
                to="/programs/courses"
                variant="primary"
                size="lg"
                className="bg-gold-500 text-plum-950 border-gold-400 hover:bg-gold-400 hover:text-plum-900 shadow-modal font-medium"
              >
                Explore Courses
              </LinkButton>

              <LinkButton
                to="/contact"
                variant="outline"
                size="lg"
                className="border-gold-400/60 text-gold-200 hover:text-white hover:border-gold-300 hover:bg-gold-500/15 bg-plum-900/60 backdrop-blur-sm shadow-sm"
              >
                Contact Us
              </LinkButton>
            </div>
          </div>
        </Container>
      </div>

      {/* Hero Bottom Controls & Metrics Bar */}
      <div className="relative z-10 border-t border-gold-500/20 bg-plum-950/80 backdrop-blur-md">
        <Container size="wide" clean className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left: Metrics */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full lg:w-auto">
              {HERO_METRICS.map((metric, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-editorial text-gold-300 font-normal tracking-tight">
                    {metric.value}
                  </div>
                  <div className="text-xs font-sans text-white font-medium">
                    {metric.label}
                  </div>
                  {metric.detail ? (
                    <div className="text-[10px] text-white/60 font-sans hidden sm:block">
                      {metric.detail}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Right: Slide Controls & Progress */}
            <div className="flex items-center justify-between sm:justify-end w-full lg:w-auto space-x-6">
              {/* Slide Indicators */}
              <div className="flex items-center space-x-2" role="tablist">
                {HERO_SLIDES.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(idx)}
                    role="tab"
                    aria-selected={idx === currentSlide}
                    aria-label={`Go to slide ${idx + 1}: ${s.title}`}
                    className={cn(
                      'transition-all duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gold-400',
                      idx === currentSlide
                        ? 'w-8 h-1.5 bg-gold-400'
                        : 'w-2 h-1.5 bg-white/40 hover:bg-white/70'
                    )}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="w-9 h-9 rounded-full border border-gold-500/40 flex items-center justify-center text-white/90 hover:text-gold-300 hover:border-gold-400 hover:bg-gold-500/20 bg-plum-900/40 transition-colors focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="w-9 h-9 rounded-full border border-gold-500/40 flex items-center justify-center text-white/90 hover:text-gold-300 hover:border-gold-400 hover:bg-gold-500/20 bg-plum-900/40 transition-colors focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

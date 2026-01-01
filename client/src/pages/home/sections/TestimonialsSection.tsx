import type { Dispatch, SetStateAction } from "react";
import type { Story } from "../types/home.types";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface TestimonialsSectionProps {
  stories: Story[];
  storyIndex: number;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  goToStory: (index: number) => void;
  prevStory: () => void;
  nextStory: () => void;
  prefersReducedMotion: boolean;
}

export default function TestimonialsSection({
  stories,
  storyIndex,
  isPaused,
  setIsPaused,
  goToStory,
  prevStory,
  nextStory,
  prefersReducedMotion,
}: TestimonialsSectionProps) {
  return (
    <section
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible"
      style={{
        background: '#ffffff'
      }}
      aria-labelledby="stories-heading"
      data-testid="section-stories"
    >
      {/* Geometric decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large teal circle - top right */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5"
          style={{
            background: '#14b8a6'
          }}
        />
        {/* Orange square - bottom left */}
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rotate-12 opacity-5"
          style={{
            background: '#f97316'
          }}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;700&display=swap');

        @keyframes testimonial-slide-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .testimonial-quote {
          font-family: 'DM Serif Display', Georgia, serif;
          animation: testimonial-slide-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .float-icon {
          animation: float-gentle 3s ease-in-out infinite;
        }
      `}</style>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          {/* Decorative element above title */}
          <div className="inline-flex items-center gap-4 mb-10">
            <div
              className="h-1 w-16 rounded-full"
              style={{
                background: '#14b8a6',
              }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{
                background: '#f97316',
              }}
            />
            <div
              className="h-1 w-16 rounded-full"
              style={{
                background: '#14b8a6',
              }}
            />
          </div>

          <h2
            id="stories-heading"
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
           <span className="italic">Testimonials</span>
          </h2>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: '#475569'
            }}
          >
            Anonymized snapshots of how people are using Reframe.me.
          </p>
        </div>

        {/* Two Column Layout - Story Showcase + Donate CTA */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Story Showcase */}
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main story container */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: '#ffffff',
                border: '4px solid #14b8a6',
                boxShadow: '0 30px 80px rgba(20, 184, 166, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
              role="region"
              aria-roledescription="carousel"
              aria-label="Stories of change"
            >
            {/* Decorative top color bar */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{
                background: 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)',
              }}
            />

            {/* Story content */}
            <div className="relative px-8 py-16 md:px-16 md:py-24">
              {/* Decorative quote mark - large and bold */}
              <div
                className="absolute top-8 left-6 md:left-10 text-[10rem] md:text-[16rem] leading-none opacity-15 pointer-events-none select-none font-bold"
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  color: '#f97316',
                }}
                aria-hidden="true"
              >
                "
              </div>

              {/* Story content with stacked positioning */}
              <div className="relative" style={{ minHeight: '280px' }}>
                {stories.map((story, index) => {
                  const isActive = index === storyIndex;
                  return (
                    <div
                      key={index}
                      className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-700 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${index + 1} of ${stories.length}`}
                      aria-hidden={!isActive}
                    >
                      {/* Quote text */}
                      <blockquote
                        className={`testimonial-quote text-2xl md:text-4xl lg:text-5xl leading-tight md:leading-tight lg:leading-tight font-normal italic mb-10 md:mb-12 relative ${prefersReducedMotion ? '' : ''
                          }`}
                        style={{
                          color: '#0f172a',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {story.quote}
                      </blockquote>

                      {/* Attribution */}
                      <div className="flex items-center gap-4 relative">
                        <div
                          className="h-1 flex-1 max-w-[60px] rounded-full"
                          style={{
                            background: '#14b8a6',
                          }}
                        />
                        <p
                          className="text-sm md:text-base font-bold tracking-wider uppercase"
                          style={{
                            letterSpacing: '0.15em',
                            color: '#0d9488'
                          }}
                        >
                          {story.role}
                        </p>
                        <div
                          className="h-1 flex-1 max-w-[60px] rounded-full"
                          style={{
                            background: '#f97316',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Decorative bottom color bar */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2"
              style={{
                background: 'linear-gradient(90deg, #f97316 0%, #14b8a6 100%)',
              }}
            />
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {/* Previous button */}
            <button
              onClick={prevStory}
              aria-label="Previous story"
              data-testid="button-story-prev"
              className="group relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{
                background: '#14b8a6',
                boxShadow: '0 6px 24px rgba(20, 184, 166, 0.3)',
              }}
            >
              <ChevronLeft className="w-6 h-6 text-white mx-auto transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            </button>

            {/* Dots navigation */}
            <div
              className="flex items-center gap-3"
              role="tablist"
              aria-label="Story slides"
            >
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStory(index)}
                  className={`rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${index === storyIndex
                    ? 'w-12 h-3'
                    : 'w-3 h-3 hover:scale-150'
                    }`}
                  style={{
                    background: index === storyIndex
                      ? 'linear-gradient(90deg, #14b8a6 0%, #f97316 100%)'
                      : '#cbd5e1',
                    boxShadow: index === storyIndex
                      ? '0 4px 16px rgba(20, 184, 166, 0.4)'
                      : 'none',
                  }}
                  role="tab"
                  aria-selected={index === storyIndex}
                  aria-label={`Go to story ${index + 1}`}
                  data-testid={`button-story-dot-${index}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={nextStory}
              aria-label="Next story"
              data-testid="button-story-next"
              className="group relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{
                background: '#f97316',
                boxShadow: '0 6px 24px rgba(249, 115, 22, 0.3)',
              }}
            >
              <ChevronRight className="w-6 h-6 text-white mx-auto transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
          </div>

          {/* RIGHT COLUMN: Donate CTA */}
          <div className="flex flex-col justify-center items-center text-center space-y-8 px-4 md:px-6">
            {/* Decorative element - bold geometric heart */}
            <div className="relative self-center float-icon">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center relative group transition-all duration-500 hover:scale-110 hover:rotate-6"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                  boxShadow: '0 20px 50px rgba(249, 115, 22, 0.4), 0 10px 20px rgba(249, 115, 22, 0.2)',
                }}
              >
                {/* Inner border effect */}
                <div
                  className="absolute inset-2 rounded-xl border-2 border-white/30"
                />
                <Heart
                  className="w-14 h-14 text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
                  fill="white"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Heading with bold typography */}
            <h3
              className="text-3xl md:text-4xl lg:text-5xl font-bold italic leading-tight max-w-lg"
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Stories like these are why this exists
            </h3>

            {/* Description with strong contrast */}
            <p
              className="text-base md:text-lg lg:text-xl leading-relaxed max-w-md font-medium"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#475569',
              }}
            >
              If this tool has helped you or someone you know, your support helps ensure it stays free and available for everyone navigating this journey.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full md:w-auto">
              <Link href="/donate">
                <Button
                  size="lg"
                  className="group relative px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:-rotate-1 active:scale-95 overflow-hidden w-full sm:w-auto"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                    color: 'white',
                    boxShadow: '0 12px 40px rgba(249, 115, 22, 0.4)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    <Heart className="w-5 h-5 transition-transform duration-300 group-hover:scale-125" fill="currentColor" aria-hidden="true" />
                    Support This Work
                  </span>
                  {/* Shine effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                    }}
                  />
                </Button>
              </Link>

              <span className="text-sm font-bold tracking-wider uppercase" style={{ color: '#94a3b8' }}>or</span>

              <a
                href="/donate"
                className="text-base font-bold underline underline-offset-4 decoration-2 hover:underline-offset-8 transition-all duration-300"
                style={{
                  color: '#14b8a6',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Share with someone who needs it
              </a>
            </div>

            {/* Note with clear typography */}
            <p
              className="text-sm italic pt-2 font-medium max-w-sm"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: '#64748b',
              }}
            >
              Every bit helps—but this tool is here for you whether you can give or not.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

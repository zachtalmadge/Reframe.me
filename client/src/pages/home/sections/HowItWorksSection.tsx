import React from "react";
import type { RefObject } from "react";
import type { HowItWorksStep } from "../types/home.types";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HowItWorksSectionProps {
  howItWorksRef: RefObject<HTMLElement>;
  howItWorksInView: boolean;
  howItWorksSteps: HowItWorksStep[];
}

export default function HowItWorksSection({
  howItWorksRef,
  howItWorksInView,
  howItWorksSteps,
}: HowItWorksSectionProps) {
  return (
    <section
      ref={howItWorksRef as React.RefObject<HTMLElement>}
      className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-x-hidden overflow-y-visible"
      aria-labelledby="how-it-works-heading"
      data-testid="section-how-it-works"
      style={{
        background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 50%, #fef3c7 100%)'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');

        @keyframes draw-line {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulse-step {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes glow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .step-card-hover {
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .step-card-hover:hover {
          transform: translateY(-16px) scale(1.02);
        }

        .connecting-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 2s ease-out forwards;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)'
          }}
        />
        {/* Diagonal accent lines */}
        <div
          className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(0,0,0,0.05) 50px, rgba(0,0,0,0.05) 52px)'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 md:mb-28">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600" />
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600" />
            </div>
          </div>
          <h2
            id="how-it-works-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              background: 'linear-gradient(135deg, #0f172a 0%, #0d9488 50%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em'
            }}
          >
            How it works
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#57534e' }}>
            Three clear steps from feeling stuck to feeling <strong style={{ color: '#0d9488' }}>prepared</strong>.
          </p>
        </div>

        {/* Process Flow */}
        <div className="max-w-6xl mx-auto mb-20">
          {/* Desktop - Horizontal Flow */}
          <div className="hidden lg:block relative">
            {/* SVG Connecting Lines */}
            <svg className="absolute top-32 left-0 w-full h-32 pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d="M 260 40 Q 320 40, 380 40"
                stroke="url(#lineGradient1)"
                strokeWidth="3"
                fill="none"
                className={`connecting-line ${howItWorksInView ? '' : ''}`}
                style={{ animationDelay: '0.5s' }}
              />
              <path
                d="M 640 40 Q 700 40, 760 40"
                stroke="url(#lineGradient2)"
                strokeWidth="3"
                fill="none"
                className={`connecting-line ${howItWorksInView ? '' : ''}`}
                style={{ animationDelay: '1s' }}
              />
            </svg>

            <div className="grid grid-cols-3 gap-12 relative z-10">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`step-card-hover transition-all duration-700 ${howItWorksInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                    }`}
                  style={{
                    transitionDelay: howItWorksInView ? `${index * 200}ms` : "0ms",
                  }}
                  data-testid={`step-${index + 1}`}
                >
                  {/* Card */}
                  <div
                    className="relative rounded-3xl p-8 md:p-10 overflow-hidden group h-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      border: '2px solid rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                      minHeight: '380px'
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: index === 0
                          ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.05) 0%, transparent 100%)'
                          : index === 1
                            ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, transparent 100%)'
                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%)'
                      }}
                    />

                    {/* Step Number Badge */}
                    <div className="relative mb-8">
                      <div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl relative group-hover:scale-110 transition-transform duration-500"
                        style={{
                          background: index === 0
                            ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                            : index === 1
                              ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                          boxShadow: `0 10px 30px ${index === 0
                            ? 'rgba(20, 184, 166, 0.4)'
                            : index === 1
                              ? 'rgba(249, 115, 22, 0.4)'
                              : 'rgba(139, 92, 246, 0.4)'
                            }`
                        }}
                      >
                        <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, system-ui, sans-serif' }}>
                          {index + 1}
                        </span>
                      </div>
                      {/* Glow ring */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: index === 0
                            ? 'radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%)'
                            : index === 1
                              ? 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, transparent 70%)'
                              : 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                          transform: 'scale(2)',
                          filter: 'blur(20px)'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      <h3
                        className="text-2xl md:text-3xl font-bold leading-tight"
                        style={{
                          fontFamily: 'Cabinet Grotesk, system-ui, sans-serif',
                          color: '#1c1917',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#57534e' }}>
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow hint */}
                    {index < 2 && (
                      <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                        <ArrowRight className="w-6 h-6" style={{ color: index === 0 ? '#f97316' : '#8b5cf6' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile - Vertical Stack */}
          <div className="lg:hidden space-y-4">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step.title}
                className={`transition-all duration-700 ${howItWorksInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
                  }`}
                style={{
                  transitionDelay: howItWorksInView ? `${index * 200}ms` : "0ms",
                }}
                data-testid={`step-${index + 1}`}
              >
                <div
                  className="relative rounded-3xl p-8 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)',
                    border: '2px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-start gap-6">
                    {/* Step Number */}
                    <div
                      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: index === 0
                          ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                          : index === 1
                            ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
                            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        boxShadow: `0 10px 30px ${index === 0
                          ? 'rgba(20, 184, 166, 0.4)'
                          : index === 1
                            ? 'rgba(249, 115, 22, 0.4)'
                            : 'rgba(139, 92, 246, 0.4)'
                          }`
                      }}
                    >
                      <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, system-ui, sans-serif' }}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <h3
                        className="text-xl md:text-2xl font-bold leading-tight"
                        style={{
                          fontFamily: 'Cabinet Grotesk, system-ui, sans-serif',
                          color: '#1c1917',
                          letterSpacing: '-0.02em'
                        }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-base leading-relaxed" style={{ fontFamily: 'Public Sans, sans-serif', color: '#57534e' }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connector for mobile */}
                {index < 2 && (
                  <div className="flex justify-center py-2">
                    <div className="w-1 h-8 rounded-full" style={{ background: index === 0 ? 'linear-gradient(to bottom, #14b8a6, #f97316)' : 'linear-gradient(to bottom, #f97316, #8b5cf6)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Block */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl p-10 md:p-16 text-center overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.6) 100%)',
              border: '3px solid rgba(251, 191, 36, 0.3)',
              boxShadow: '0 25px 70px rgba(251, 146, 60, 0.15)'
            }}
          >
            {/* Decorative elements */}
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"
              style={{
                background: 'radial-gradient(circle, #14b8a6 0%, transparent 70%)'
              }}
            />
            <div
              className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20 blur-3xl group-hover:scale-125 transition-transform duration-700"
              style={{
                background: 'radial-gradient(circle, #f97316 0%, transparent 70%)'
              }}
            />

            <div className="relative z-10 space-y-8">
              <div className="space-y-4">
                <p
                  className="text-3xl md:text-5xl font-bold leading-tight"
                  style={{
                    fontFamily: 'Fraunces, Georgia, serif',
                    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Your past doesn't define your future
                </p>
                <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: 'Public Sans, sans-serif', color: '#78350f' }}>
                  Every person deserves the chance to move forward. You've already taken the first step by being here.
                </p>
              </div>

              <Link href="/selection">
                <Button
                  size="lg"
                  className="group relative px-6 py-5 md:px-12 md:py-7 mt-5 text-base md:text-xl font-bold rounded-2xl transition-all duration-400 hover:scale-105 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
                    color: 'white',
                    boxShadow: '0 15px 40px rgba(249, 115, 22, 0.4)',
                    fontFamily: 'Cabinet Grotesk, system-ui, sans-serif'
                  }}
                  data-testid="button-get-started"
                >
                  <span className="relative z-10 flex items-center gap-2 md:gap-3">
                    Start Reframing Today
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  {/* Shimmer effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-300" />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

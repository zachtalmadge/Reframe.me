import { forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Lock } from "lucide-react";

interface DonatePaymentSectionProps {}

export const DonatePaymentSection = forwardRef<HTMLElement, DonatePaymentSectionProps>(
  (props, ref) => {
    return (
      <section
        ref={ref}
        className="relative py-24 md:py-32 px-6 sm:px-8 lg:px-12 scroll-mt-20 overflow-hidden dot-pattern dark:dot-pattern-dark"
      >
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 organic-blob bg-teal-200/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 organic-blob bg-orange-200/20 blur-3xl" />
        </div>

        <div className="grain-overlay" />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16 px-4">
            <div className="inline-block mb-4">
              <div className="w-20 h-1 shimmer-gradient rounded-full mx-auto mb-8" />
            </div>
            <h2 className="display-font text-3xl sm:text-4xl md:text-6xl font-bold mb-6" style={{ paddingBottom: '0.25rem' }}>
              Support Reframe.me <span className="text-gradient-warm">directly</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-medium">
              Right now, donations go straight to me (the creator) through Cash App or PayPal.
              Contributions are voluntary and help cover the real costs of keeping Reframe.me running and improving.
            </p>
          </div>

          {/* Mobile: Big Buttons (< 768px) */}
          <div className="block md:hidden space-y-6 max-w-md mx-auto mb-12">
            {/* Cash App Button */}
            <a
              href="https://cash.app/$ztalmadge"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg mb-4">
                      <span className="text-base font-bold text-white tracking-wide">Cash App</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Button
                      size="lg"
                      className="w-full min-h-[72px] text-xl font-bold shadow-xl transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '16px',
                      }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        Open Cash App
                        <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                      </span>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600 font-medium">
                    Tap to open Cash App and contribute any amount
                  </p>
                </CardContent>
              </Card>
            </a>

            {/* PayPal Button */}
            <a
              href="https://paypal.me/steezyzjt"
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full"
            >
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg mb-4">
                      <span className="text-base font-bold text-white tracking-wide">PayPal</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Button
                      size="lg"
                      className="w-full min-h-[72px] text-xl font-bold shadow-xl transition-all duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        borderRadius: '16px',
                      }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        Open PayPal
                        <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-125" />
                      </span>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-600 font-medium">
                    Tap to open PayPal and contribute any amount
                  </p>
                </CardContent>
              </Card>
            </a>
          </div>

          {/* Desktop: QR Codes + Links (>= 768px) */}
          <div className="hidden md:grid md:grid-cols-2 gap-10 max-w-4xl mx-auto mb-12">
            {/* Cash App Card */}
            <div className="qr-card">
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-green-50/50 backdrop-blur-sm">
                <CardContent className="p-10 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                      <span className="text-base font-bold text-white tracking-wide">Cash App</span>
                    </div>
                  </div>

                  <div className="flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-300 blur-2xl opacity-30 rounded-3xl transform scale-95" />
                    <div className="relative p-4 bg-white rounded-2xl shadow-xl">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://cash.app/$ztalmadge"
                        alt="Cash App QR Code"
                        className="w-56 h-56 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href="https://cash.app/$ztalmadge"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-green-700 hover:text-green-600 underline decoration-2 underline-offset-4 hover:underline-offset-8 transition-all duration-300"
                    >
                      Open CashApp
                      <span className="text-xl">→</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PayPal Card */}
            <div className="qr-card">
              <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-sm">
                <CardContent className="p-10 space-y-6">
                  <div className="text-center">
                    <div className="inline-flex px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 shadow-lg">
                      <span className="text-base font-bold text-white tracking-wide">PayPal</span>
                    </div>
                  </div>

                  <div className="flex justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 to-blue-300 blur-2xl opacity-30 rounded-3xl transform scale-95" />
                    <div className="relative p-4 bg-white rounded-2xl shadow-xl">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://paypal.me/steezyzjt"
                        alt="PayPal QR Code"
                        className="w-56 h-56 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <a
                      href="https://paypal.me/steezyzjt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg font-bold text-indigo-700 hover:text-indigo-600 underline decoration-2 underline-offset-4 hover:underline-offset-8 transition-all duration-300"
                    >
                      Open PayPal
                      <span className="text-xl">→</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Unified Instructions - Desktop Only */}
          <div className="hidden md:block max-w-3xl mx-auto mb-16">
            <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100">
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                Scan the QR code with your phone or click the link to send a one-time contribution.
                You can add <span className="font-bold text-teal-700">'Reframe.me support'</span> in the note if you'd like.
              </p>
            </div>
          </div>

          {/* Safety Notice - Enhanced */}
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50/50 p-8 shadow-lg overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 organic-blob bg-orange-200/30" />
              <div className="relative flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-orange-900 mb-2 text-lg">Important safety note</p>
                  <p className="text-base text-orange-800 leading-relaxed">
                    Please don't include any personal or sensitive legal details in payment notes.
                    Your story belongs in your documents, not in a payment memo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

DonatePaymentSection.displayName = 'DonatePaymentSection';

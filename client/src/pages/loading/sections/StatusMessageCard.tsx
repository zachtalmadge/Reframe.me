interface StatusMessageCardProps {
  message: string;
  isVisible: boolean;
}

export function StatusMessageCard({ message, isVisible }: StatusMessageCardProps) {
  return (
    <div className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(254,252,232,0.6) 100%)',
        border: '1.5px solid rgba(13, 148, 136, 0.15)',
        boxShadow: '0 8px 32px rgba(13, 148, 136, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 p-10 md:p-12">
        <p
          className={`loading-sans text-xl md:text-2xl font-bold text-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            color: '#115e59'
          }}
          data-testid="text-loading-message"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </div>
  );
}

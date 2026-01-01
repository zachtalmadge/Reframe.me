export function LoadingOrb() {
  return (
    <div className="flex items-center justify-center mb-16 md:mb-20 pt-8">
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        {/* Outer ripple rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ripple-ring w-full h-full rounded-full border-2"
            style={{
              borderColor: 'rgba(13, 148, 136, 0.2)',
              animationDelay: '0s'
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ripple-ring w-full h-full rounded-full border-2"
            style={{
              borderColor: 'rgba(13, 148, 136, 0.2)',
              animationDelay: '1.7s'
            }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="ripple-ring w-full h-full rounded-full border-2"
            style={{
              borderColor: 'rgba(249, 115, 22, 0.15)',
              animationDelay: '3.4s'
            }}
          />
        </div>

        {/* Central breathing orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="breathing-circle w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(13, 148, 136, 0.08) 60%, transparent 100%)',
              boxShadow: '0 0 60px rgba(13, 148, 136, 0.15), inset 0 0 30px rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(13, 148, 136, 0.25) 100%)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'inset 0 2px 8px rgba(255, 255, 255, 0.6)'
              }}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #14b8a6 0%, #0d9488 100%)',
                  boxShadow: '0 4px 16px rgba(13, 148, 136, 0.4)',
                  animation: 'breathe-in-out 4s ease-in-out infinite'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

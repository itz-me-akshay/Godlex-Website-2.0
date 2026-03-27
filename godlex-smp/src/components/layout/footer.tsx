export function Footer() {
  return (
    <footer className="border-t border-primary/30 bg-[#0d0117] py-12 mt-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/favicon.gif" 
            alt="Godlex Logo" 
            className="w-12 h-12 rounded-xl object-cover mb-2" 
          />
          <h3 className="font-display font-bold text-2xl">
            GODLEX<span className="text-primary">SMP</span>
          </h3>
        </div>
        <p className="text-white/60 mb-8 max-w-md mx-auto text-sm">
          A premium Minecraft survival multiplayer experience. Join our community today and start your adventure.
        </p>
        <div className="text-sm font-medium text-white/40">
          © {new Date().getFullYear()} Godlex SMP. Created by ZrockeyZore. All rights reserved.
        </div>
        <div className="mt-2 text-xs text-white/30">
          Not affiliated with Mojang AB or Microsoft.
        </div>
      </div>
    </footer>
  );
}

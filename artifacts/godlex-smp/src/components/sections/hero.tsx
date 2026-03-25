import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function Hero() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const serverIP = "play.godlexsmp.com";

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    toast({
      title: "IP Copied!",
      description: "Ready to paste into your Minecraft client.",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Cosmic gradient background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Gradients to blend into the rest of the site */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-foreground text-sm font-medium tracking-wide mb-6">
            Season 1 is LIVE
          </span>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src="/favicon.gif" 
              alt="Godlex SMP Logo" 
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl shadow-[0_0_50px_rgba(124,58,237,0.5)] border border-white/10 object-cover" 
            />
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/60 drop-shadow-sm mb-4">
            GODLEX SMP
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-primary mb-8 drop-shadow-[0_0_10px_rgba(124,58,237,0.8)]">
            The Ultimate Minecraft Experience
          </p>
          
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/70 mb-10 leading-relaxed">
            Welcome to Godlex SMP, a premium Minecraft survival multiplayer server built for passionate players. Created and managed by <span className="text-white font-semibold">ZrockeyZore</span>, Godlex SMP offers an immersive, community-driven experience with unique ranks, events, and a thriving player base.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleCopyIP}
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300 hover:-translate-y-1 border-0 group"
            >
              {copied ? (
                <Check className="mr-2 w-5 h-5 text-green-300" />
              ) : (
                <Copy className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
              {copied ? "COPIED!" : serverIP}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-bold rounded-xl bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 text-white transition-all duration-300"
              onClick={() => document.getElementById('server-status')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Features
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => document.getElementById('server-status')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 transition-colors">
          <ChevronDown className="w-5 h-5 text-primary" />
        </div>
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Discord() {
  return (
    <section id="discord" className="py-24 relative bg-background/50">
      {/* Pattern background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="inline-flex items-center justify-center p-3 bg-[#5865F2]/10 rounded-2xl mb-6 border border-[#5865F2]/20">
              <MessageSquare className="w-8 h-8 text-[#5865F2]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Join the <span className="text-[#5865F2]">Community</span>
            </h2>
            
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
              Connect with thousands of players, get the latest server updates, participate in giveaways, and find friends for your next adventure. The Godlex SMP Discord is where the magic happens offline.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="h-14 px-8 text-lg font-bold rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:shadow-[0_0_30px_rgba(88,101,242,0.5)] transition-all duration-300 hover:-translate-y-1 border-0"
                onClick={() => window.open("https://discord.gg/FC6S3THz5p", "_blank")}
              >
                Join Our Discord
              </Button>
            </div>
            
            <div className="mt-8 flex items-center gap-4 text-sm text-white/50 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active Voice Chats</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Fast Support</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#5865F2] to-primary rounded-[20px] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative glass-card rounded-[18px] p-2 bg-[#1e1f22]/80 backdrop-blur-xl border-[#5865F2]/20">
                <iframe 
                  src="https://discord.com/widget?id=1441615784118980661&theme=dark" 
                  width="350" 
                  height="500" 
                  allowTransparency={true} 
                  frameBorder="0" 
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="rounded-xl w-full max-w-[350px]"
                  title="Discord Widget"
                ></iframe>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

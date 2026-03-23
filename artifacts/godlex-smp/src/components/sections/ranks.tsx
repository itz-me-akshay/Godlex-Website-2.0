import { motion } from "framer-motion";
import { CheckCircle2, Shield, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RANKS = [
  {
    id: "member",
    name: "Member",
    price: "Free",
    icon: User,
    color: "text-slate-300",
    bgColor: "bg-slate-300/10",
    borderColor: "border-slate-300/30",
    glow: "shadow-[0_0_30px_-10px_rgba(203,213,225,0.3)]",
    perks: [
      "Access to survival world",
      "Basic /home and /spawn commands",
      "Join the community Discord",
      "Participate in server events",
      "Build and explore freely"
    ],
    popular: false,
  },
  {
    id: "knight",
    name: "Knight",
    price: "$9.99/mo",
    icon: Shield,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/50",
    glow: "shadow-[0_0_40px_-5px_rgba(250,204,21,0.4)]",
    perks: [
      "Everything in Member",
      "3 home locations",
      "Priority server join",
      "Exclusive Knight title and prefix",
      "Access to Knight-only areas",
      "Monthly in-game reward kit"
    ],
    popular: true,
  },
  {
    id: "godlex",
    name: "Godlex",
    price: "$24.99/mo",
    icon: Crown,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/50",
    glow: "shadow-[0_0_40px_-5px_rgba(124,58,237,0.5)]",
    perks: [
      "Everything in Knight",
      "Unlimited home locations",
      "VIP lounge access",
      "Custom name color",
      "Direct line to server admins",
      "Exclusive Godlex cosmetics",
      "Early access to new features",
      "Double in-game currency rewards"
    ],
    popular: false,
  }
];

export function Ranks() {
  return (
    <section id="ranks" className="py-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Support the <span className="text-primary">Server</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Enhance your gameplay with exclusive perks while keeping Godlex SMP running.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className={cn("relative h-full", rank.popular ? "md:-mt-8 md:mb-8 z-20" : "z-10")}
            >
              <Card 
                className={cn(
                  "glass-card flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-2",
                  rank.borderColor,
                  rank.glow,
                  rank.popular ? "bg-[#0d0117]/90 border-2" : ""
                )}
              >
                {rank.popular && (
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-yellow-950 text-xs font-bold uppercase tracking-widest text-center py-1.5 shadow-md">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8 flex-grow flex flex-col">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", rank.bgColor)}>
                    <rank.icon className={cn("w-7 h-7", rank.color)} />
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{rank.name}</h3>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">{rank.price}</span>
                  </div>
                  
                  <div className="w-full h-px bg-white/10 mb-6"></div>
                  
                  <ul className="space-y-4 mb-8 flex-grow">
                    {rank.perks.map((perk, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className={cn("w-5 h-5 shrink-0 mr-3 mt-0.5", rank.color)} />
                        <span className="text-sm text-white/80 leading-tight">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={cn(
                      "w-full h-12 text-base font-bold rounded-xl border-0 mt-auto",
                      rank.popular 
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-yellow-950" 
                        : rank.id === 'godlex'
                          ? "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                          : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                    onClick={() => window.open("https://store.godlexsmp.com", "_blank")} // Placeholder URL
                  >
                    {rank.id === 'member' ? "Join Free" : "Get Rank"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

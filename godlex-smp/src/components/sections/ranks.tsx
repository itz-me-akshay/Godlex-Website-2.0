import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RANKS = [
  {
    id: "vip",
    name: "VIP",
    price: "₹29",
    popular: false,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    glow: "shadow-[0_0_30px_-10px_rgba(168,85,247,0.4)]",
    btnClass: "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    perks: [
      "Purple [VIP] prefix in chat",
      "3 home locations",
      "Access to VIP lounge",
      "Monthly reward kit",
    ],
  },
  {
    id: "mvp",
    name: "MVP",
    price: "₹49",
    popular: true,
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/40",
    glow: "shadow-[0_0_40px_-5px_rgba(217,70,239,0.5)]",
    btnClass: "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.35)]",
    perks: [
      "Everything in VIP",
      "Purple [MVP] prefix in chat",
      "5 home locations",
      "Custom chat color",
      "Priority server join",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: "₹129",
    popular: false,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    glow: "shadow-[0_0_30px_-10px_rgba(59,130,246,0.4)]",
    btnClass: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    perks: [
      "Everything in MVP",
      "Blue [Elite] prefix in chat",
      "10 home locations",
      "Access to Elite-only areas",
      "Double in-game currency",
    ],
  },
  {
    id: "god",
    name: "God",
    price: "₹199",
    popular: false,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    glow: "shadow-[0_0_40px_-5px_rgba(234,179,8,0.45)]",
    btnClass: "bg-gradient-to-r from-yellow-500 to-amber-400 hover:from-yellow-400 hover:to-amber-300 text-yellow-950 font-extrabold shadow-[0_0_20px_rgba(234,179,8,0.4)]",
    perks: [
      "Everything in Elite",
      "Golden [God] prefix in chat",
      "Unlimited home locations",
      "Direct line to admins",
      "Exclusive God cosmetics",
      "Early access to new features",
    ],
  },
];

export function Ranks() {
  return (
    <section id="ranks" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Support the <span className="text-primary">Server</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Enhance your gameplay with exclusive perks while keeping Godlex SMP running.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {RANKS.map((rank, index) => (
            <motion.div
              key={rank.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn("relative h-full", rank.popular ? "lg:-mt-4 z-20" : "z-10")}
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
                  <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white text-xs font-bold uppercase tracking-widest text-center py-1.5">
                    Most Popular
                  </div>
                )}

                <div className="p-6 flex-grow flex flex-col">
                  {/* Icon */}
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-5", rank.bgColor)}>
                    <Star className={cn("w-6 h-6", rank.color)} />
                  </div>

                  <h3 className="text-2xl font-display font-bold text-white mb-1">{rank.name}</h3>
                  <div className="mb-5">
                    <span className="text-4xl font-black text-white">{rank.price}</span>
                  </div>

                  <div className="w-full h-px bg-white/10 mb-5" />

                  <ul className="space-y-3 mb-6 flex-grow">
                    {rank.perks.map((perk, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className={cn("w-4 h-4 shrink-0 mr-2.5 mt-0.5", rank.color)} />
                        <span className="text-sm text-white/80 leading-tight">{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn("w-full h-11 text-base font-bold rounded-xl border-0 mt-auto", rank.btnClass)}
                    onClick={() => window.open("https://discord.gg/FC6S3THz5p", "_blank")}
                  >
                    Get {rank.name}
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

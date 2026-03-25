import { motion } from "framer-motion";
import { Server, Users, Activity, Loader2 } from "lucide-react";
import { useServerStatus } from "@/hooks/use-server-status";
import { Card } from "@/components/ui/card";

export function ServerStatus() {
  const { data: status, isLoading, isError } = useServerStatus();

  return (
    <section id="server-status" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Live <span className="text-primary">Status</span></h2>
          <p className="text-white/60 max-w-2xl mx-auto">Real-time statistics straight from the Godlex SMP network.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card p-6 h-full border-t-2 border-t-primary/50 relative overflow-hidden group hover:bg-white/[0.07] transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Server Status</h3>
                  <p className="text-sm text-white/50">Connection Health</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                {isLoading ? (
                  <div className="flex items-center text-white/70">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Checking...
                  </div>
                ) : isError || !status ? (
                  <div className="flex items-center text-destructive">
                    <span className="w-3 h-3 rounded-full bg-destructive mr-2 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                    <span className="font-bold text-xl">OFFLINE</span>
                  </div>
                ) : status.online ? (
                  <div className="flex items-center text-green-400">
                    <span className="w-3 h-3 rounded-full bg-green-400 mr-2 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></span>
                    <span className="font-bold text-xl tracking-wider">ONLINE</span>
                  </div>
                ) : (
                  <div className="flex items-center text-destructive">
                    <span className="w-3 h-3 rounded-full bg-destructive mr-2 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
                    <span className="font-bold text-xl">OFFLINE</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Players Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card p-6 h-full border-t-2 border-t-blue-500/50 relative overflow-hidden group hover:bg-white/[0.07] transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Active Players</h3>
                  <p className="text-sm text-white/50">Current Population</p>
                </div>
              </div>
              <div className="mt-6">
                {isLoading ? (
                  <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
                ) : status?.online ? (
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-bold text-3xl text-white">{status.players?.online || 0}</span>
                    <span className="text-white/50 font-medium">/ {status.players?.max || 0} online</span>
                  </div>
                ) : (
                  <span className="text-white/50 italic">Server Unreachable</span>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Version Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card p-6 h-full border-t-2 border-t-purple-400/50 relative overflow-hidden group hover:bg-white/[0.07] transition-colors">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl group-hover:bg-purple-400/30 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-lg bg-purple-400/20 flex items-center justify-center">
                  <Server className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Server Info</h3>
                  <p className="text-sm text-white/50">Version & IP</p>
                </div>
              </div>
              <div className="mt-6 space-y-1">
                {isLoading ? (
                  <>
                    <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-40 bg-white/5 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-xl text-white">
                      {status?.version || "Unknown"}
                    </div>
                    <div className="text-primary font-medium text-sm">
                      play.godlexsmp.com
                    </div>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

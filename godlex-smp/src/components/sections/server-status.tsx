import { motion } from "framer-motion";
import { Wifi, WifiOff, Users, Server, RefreshCw } from "lucide-react";
import { useServerStatus } from "@/hooks/use-server-status";

export function ServerStatus() {
  const { data, isLoading, isError, refetch } = useServerStatus();

  const online = data?.online ?? false;

  return (
    <section id="server-status" className="py-24 relative bg-background/50">
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Server <span className="text-primary">Status</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Live status of the Godlex SMP server.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card rounded-2xl border border-white/10 p-8">
            {isLoading ? (
              <div className="flex items-center justify-center gap-3 text-white/50">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Checking server...</span>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center gap-3 text-red-400">
                <WifiOff className="w-5 h-5" />
                <span>Could not reach server</span>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {online ? (
                      <Wifi className="w-6 h-6 text-green-400" />
                    ) : (
                      <WifiOff className="w-6 h-6 text-red-400" />
                    )}
                    <span className="text-xl font-bold text-white">
                      {online ? "Online" : "Offline"}
                    </span>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        online ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" : "bg-red-400"
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="text-white/30 hover:text-white/60 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-full h-px bg-white/10" />

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Server className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">IP</p>
                      <p className="text-sm font-semibold text-white font-mono">
                        play.godlexsmp.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Players</p>
                      <p className="text-sm font-semibold text-white">
                        {online && data?.players
                          ? `${data.players.online} / ${data.players.max}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {data?.version && (
                    <div className="col-span-2 flex items-center gap-3">
                      <div>
                        <p className="text-xs text-white/40 uppercase tracking-wider">Version</p>
                        <p className="text-sm font-semibold text-white">{data.version}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Player bar */}
                {online && data?.players && (
                  <div>
                    <div className="flex justify-between text-xs text-white/40 mb-2">
                      <span>Capacity</span>
                      <span>
                        {Math.round((data.players.online / data.players.max) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(data.players.online / data.players.max) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

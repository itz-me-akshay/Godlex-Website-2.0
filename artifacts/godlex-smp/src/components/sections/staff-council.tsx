import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Briefcase } from "lucide-react";

interface StaffMember {
  name: string;
  discordId: string;
  role: "Owner" | "CEO";
}

const STAFF: StaffMember[] = [
  { name: "ZrockeyZore", discordId: "1390656103800639683", role: "Owner" },
  { name: "Niranjan", discordId: "1397883506620764262", role: "Owner" },
  { name: "Spade", discordId: "1422810770810605588", role: "Owner" },
  { name: "Akshay", discordId: "1465701978180157697", role: "CEO" },
  { name: "Aadhi", discordId: "1190272344753717258", role: "CEO" },
];

interface DiscordUser {
  id: string;
  username: string;
  avatar: { id: string | null; link: string | null; is_animated: boolean };
  global_name: string | null;
}

function useDiscordAvatar(discordId: string) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://discordlookup.mesalytic.moe/v1/user/${discordId}`)
      .then((r) => r.json())
      .then((data: DiscordUser) => {
        if (data?.avatar?.link) {
          setAvatarUrl(data.avatar.link);
        }
      })
      .catch(() => {});
  }, [discordId]);

  const fallback = `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(discordId) % 6n)}.png`;
  return avatarUrl ?? fallback;
}

function StaffCard({ member, index }: { member: StaffMember; index: number }) {
  const avatarUrl = useDiscordAvatar(member.discordId);
  const isOwner = member.role === "Owner";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative"
    >
      {/* Glow behind card */}
      <div
        className={`absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500 ${
          isOwner
            ? "bg-gradient-to-br from-yellow-400/60 to-primary/60"
            : "bg-gradient-to-br from-primary/60 to-blue-500/60"
        }`}
      />

      <div className="relative glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 border border-white/10 group-hover:border-white/20 transition-colors">
        {/* Role badge */}
        <div
          className={`absolute top-4 right-4 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
            isOwner
              ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/30"
              : "bg-primary/15 text-primary border border-primary/30"
          }`}
        >
          {isOwner ? <Crown className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
          {member.role}
        </div>

        {/* Avatar */}
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full blur-md opacity-50 ${
              isOwner ? "bg-yellow-400/40" : "bg-primary/40"
            }`}
          />
          <img
            src={avatarUrl}
            alt={member.name}
            className="relative w-20 h-20 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = `https://cdn.discordapp.com/embed/avatars/0.png`;
            }}
          />
          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-background" />
        </div>

        {/* Name */}
        <div>
          <h3 className="font-display font-bold text-lg text-white leading-tight">
            {member.name}
          </h3>
          <p className="text-xs text-white/40 mt-1 font-mono">
            #{member.discordId.slice(-4)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function StaffCouncil() {
  const owners = STAFF.filter((m) => m.role === "Owner");
  const ceos = STAFF.filter((m) => m.role === "CEO");

  return (
    <section id="staff" className="py-24 relative">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white/70 mb-4">
            <Crown className="w-4 h-4 text-yellow-400" />
            The Team Behind the Server
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-2">
            Staff <span className="text-primary">Council</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-lg mx-auto">
            The dedicated leaders who build, maintain, and grow the Godlex SMP community.
          </p>
        </motion.div>

        {/* Owners */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <Crown className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-display font-semibold text-yellow-300 tracking-wide uppercase">
              Owners
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-yellow-400/30 to-transparent" />
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {owners.map((m, i) => (
              <StaffCard key={m.discordId} member={m} index={i} />
            ))}
          </div>
        </div>

        {/* CEOs */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-display font-semibold text-primary tracking-wide uppercase">
              CEO
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {ceos.map((m, i) => (
              <StaffCard key={m.discordId} member={m} index={owners.length + i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

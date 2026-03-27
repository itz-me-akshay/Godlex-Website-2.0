import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown, Briefcase } from "lucide-react";

interface StaffMember {
  name: string;
  userId: string;
}

interface DiscordUser {
  avatar: string | null;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
  } | null;
}

const OWNERS: StaffMember[] = [
  { name: "ZrockeyZore", userId: "1390656103800639683" },
  { name: "Niranjan",    userId: "1397883506620764262" },
  { name: "Spade",       userId: "1422810770810605588" },
];

const CEOS: StaffMember[] = [
  { name: "Akshay", userId: "1465701978180157697" },
  { name: "Aadhi",  userId: "1190272344753717258" },
];

function getDefaultAvatar(userId: string): string {
  const index = Number(BigInt(userId) % BigInt(5));
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

function getAvatarUrl(userId: string, hash: string | null): string {
  if (!hash) return getDefaultAvatar(userId);
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userId}/${hash}.${ext}?size=128`;
}

function getDecorUrl(asset: string): string {
  return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
}

function MemberCard({ member, role, icon }: { member: StaffMember; role: string; icon: React.ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`https://api.lanyard.rest/v1/users/${member.userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.discord_user) {
          setUser({
            avatar: data.data.discord_user.avatar,
            avatar_decoration_data: data.data.discord_user.avatar_decoration_data ?? null,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [member.userId]);

  const avatarUrl = loaded
    ? getAvatarUrl(member.userId, user?.avatar ?? null)
    : null;

  const decorUrl =
    loaded && user?.avatar_decoration_data?.asset
      ? getDecorUrl(user.avatar_decoration_data.asset)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center gap-3 group"
    >
      {/* Avatar wrapper */}
      <div className="relative">
        {/* Glow ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-secondary opacity-40 blur-md group-hover:opacity-70 transition duration-300" />

        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-white/5">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getDefaultAvatar(member.userId);
              }}
            />
          ) : (
            <div className="w-full h-full bg-white/10 animate-pulse rounded-full" />
          )}
        </div>

        {/* Avatar decoration overlay */}
        {decorUrl && (
          <img
            src={decorUrl}
            alt="decoration"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: "scale(1.15)" }}
          />
        )}

        {/* Role icon badge */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-white text-sm">{member.name}</p>
        <p className="text-xs text-white/50 mt-0.5">{role}</p>
      </div>
    </motion.div>
  );
}

function RoleGroup({
  title,
  members,
  role,
  icon,
  accent,
}: {
  title: string;
  members: StaffMember[];
  role: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Role label */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${accent}`}>
        {icon}
        {title}
      </div>

      {/* Members row */}
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((m) => (
          <MemberCard key={m.userId} member={m} role={role} icon={icon} />
        ))}
      </div>
    </div>
  );
}

export function StaffTeam() {
  return (
    <section id="staff-team" className="py-24 relative bg-background/50">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 border border-primary/20">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Team</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            The people who keep Godlex SMP running — day and night.
          </p>
        </motion.div>

        {/* Groups */}
        <div className="flex flex-col items-center gap-16">
          <RoleGroup
            title="Owner"
            members={OWNERS}
            role="Owner"
            icon={<Crown className="w-3.5 h-3.5 text-yellow-400" />}
            accent="bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
          />

          {/* Divider */}
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <RoleGroup
            title="CEO"
            members={CEOS}
            role="CEO"
            icon={<Briefcase className="w-3.5 h-3.5 text-purple-400" />}
            accent="bg-purple-500/10 border-purple-500/20 text-purple-400"
          />
        </div>
      </div>
    </section>
  );
}

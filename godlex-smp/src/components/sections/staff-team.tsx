import { motion } from "framer-motion";
import { Crown, Briefcase, Shield } from "lucide-react";

interface StaffMember {
  name: string;
  avatar: string;
}

const OWNERS: StaffMember[] = [
  { name: "ZrockeyZore", avatar: "AVATAR_LINK" },
  { name: "Niranjan",    avatar: "AVATAR_LINK" },
  { name: "Spade",       avatar: "AVATAR_LINK" },
];

const CEOS: StaffMember[] = [
  { name: "Akshay", avatar: "AVATAR_LINK" },
  { name: "Aadhi",  avatar: "AVATAR_LINK" },
];

const HELPERS: StaffMember[] = [
  { name: "Zikki",        avatar: "AVATAR_LINK" },
  { name: "Hombanstar",   avatar: "AVATAR_LINK" },
  { name: "Ultrabench27", avatar: "AVATAR_LINK" },
  { name: "Iconic",       avatar: "AVATAR_LINK" },
  { name: "Soul Dude",    avatar: "AVATAR_LINK" },
  { name: "Fluidlight",   avatar: "AVATAR_LINK" },
  { name: "Tender",       avatar: "AVATAR_LINK" },
];

function MemberCard({
  member,
  role,
  icon,
}: {
  member: StaffMember;
  role: string;
  icon: React.ReactNode;
}) {
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
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>

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
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${accent}`}
      >
        {icon}
        {title}
      </div>

      {/* Members row */}
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((m) => (
          <MemberCard key={m.name} member={m} role={role} icon={icon} />
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
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
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
            Staff{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Team
            </span>
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

          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <RoleGroup
            title="CEO"
            members={CEOS}
            role="CEO"
            icon={<Briefcase className="w-3.5 h-3.5 text-purple-400" />}
            accent="bg-purple-500/10 border-purple-500/20 text-purple-400"
          />

          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <RoleGroup
            title="Godlex Helpers"
            members={HELPERS}
            role="Helper"
            icon={<Shield className="w-3.5 h-3.5 text-white" />}
            accent="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
    </section>
  );
}

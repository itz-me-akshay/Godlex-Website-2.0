import { motion } from "framer-motion";
import { Crown, Briefcase, HandHeart } from "lucide-react";

interface StaffMember {
  name: string;
  avatar: string;
}

const OWNERS: StaffMember[] = [
  { name: "ZrockeyZore", avatar: "https://cdn.discordapp.com/avatars/1390656103800639683/c32a9b05825585864dd0af976996292c.png?size=1024" },
  { name: "Niranjan",    avatar: "https://cdn.discordapp.com/avatars/1397883506620764262/20e8e381263a8cf42b9a91f7b1f956b6.webp?size=1024" },
  { name: "Spade",       avatar: "https://cdn.discordapp.com/avatars/1422810770810605588/95b1a7e19dd9e16314750a60e3c40887.webp?size=1024" },
];

const CEOS: StaffMember[] = [
  { name: "Akshay", avatar: "https://cdn.discordapp.com/avatars/1465701978180157697/1a73acf8e8ed34c4726dc3e234ca1962.webp?size=1024" },
  { name: "Aadhi",  avatar: "https://cdn.discordapp.com/avatars/1190272344753717258/6b820a2f812c30447e11f107590e6741.webp?size=1024" },
];

const HELPERS: StaffMember[] = [
  { name: "Zikki",        avatar: "https://cdn.discordapp.com/avatars/1314598265739542608/7a04082a3315e43674b775256450f34e.webp?size=1024" },
  { name: "Hombanstar",   avatar: "https://cdn.discordapp.com/avatars/1376209377328889988/f710a85d6836b1cac9bd05d76507cf3f.webp?size=1024" },
  { name: "Ultrabench27", avatar: "https://cdn.discordapp.com/avatars/1130390591281319967/98489dd54e101ab3bc626a9eeaf63063.webp?size=1024" },
  { name: "Iconic",       avatar: "https://cdn.discordapp.com/avatars/1252296678216568927/0d331f82dcaf87b82353ff84ffc61007.webp?size=1024" },
  { name: "Soul Dude",    avatar: "https://cdn.discordapp.com/avatars/1364121460125204501/c855b4e779e7b43365707245fb30b158.webp?size=1024" },
  { name: "Fluidlight",   avatar: "https://cdn.discordapp.com/avatars/1371813477886197932/a_035ece4231094248271bcf4ca7dd74e3.gif?size=1024" },
  { name: "Tender",       avatar: "https://cdn.discordapp.com/avatars/1405576798766632990/3006703a5d8d3884eacf976c1051e0a8.webp?size=1024" },
];

function MemberCard({ member, role, badge }: {
  member: StaffMember;
  role: string;
  badge: React.ReactNode;
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
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary to-secondary opacity-40 blur-md group-hover:opacity-70 transition duration-300" />
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-white/5">
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center">
          {badge}
        </div>
      </div>
      <div className="text-center">
        <p className="font-bold text-white text-sm">{member.name}</p>
        <p className="text-xs text-white/50 mt-0.5">{role}</p>
      </div>
    </motion.div>
  );
}

function RoleGroup({ title, members, role, badge, accent, titleColor }: {
  title: string;
  members: StaffMember[];
  role: string;
  badge: React.ReactNode;
  accent: string;
  titleColor: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${accent}`}>
        {badge}
        <span className={titleColor}>{title}</span>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {members.map((m) => (
          <MemberCard key={m.name} member={m} role={role} badge={badge} />
        ))}
      </div>
    </div>
  );
}

export function StaffTeam() {
  return (
    <section id="staff-team" className="py-24 relative bg-background/50">
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

        <div className="flex flex-col items-center gap-16">
          <RoleGroup
            title="Owner"
            members={OWNERS}
            role="Owner"
            badge={<Crown className="w-3.5 h-3.5 text-yellow-400" />}
            accent="bg-yellow-500/10 border-yellow-500/20"
            titleColor="text-yellow-400"
          />

          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <RoleGroup
            title="CEO"
            members={CEOS}
            role="CEO"
            badge={<Briefcase className="w-3.5 h-3.5 text-purple-400" />}
            accent="bg-purple-500/10 border-purple-500/20"
            titleColor="text-purple-400"
          />

          <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <RoleGroup
            title="Godlex Helpers"
            members={HELPERS}
            role="Helper"
            badge={<HandHeart className="w-3.5 h-3.5 text-white" />}
            accent="bg-white/5 border-white/20"
            titleColor="text-white"
          />
        </div>
      </div>
    </section>
  );
}

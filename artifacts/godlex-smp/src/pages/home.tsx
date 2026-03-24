import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { ServerStatus } from "@/components/sections/server-status";
import { Ranks } from "@/components/sections/ranks";
import { Discord } from "@/components/sections/discord";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col selection:bg-primary/30 selection:text-white">
      <Navbar />

      <div className="flex-1">
        <Hero />

        {/* Subtle divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <ServerStatus />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <Ranks />

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <Discord />
      </div>

      <Footer />
    </main>
  );
}

import { useState, useEffect } from "react";
import { Menu, X, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Server Status", href: "#server-status" },
  { name: "Ranks", href: "#ranks" },
  { name: "Discord", href: "#discord" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <img 
              src="/favicon.gif" 
              alt="Godlex Logo" 
              className="w-10 h-10 rounded-xl shadow-lg shadow-primary/20 object-cover" 
            />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              GODLEX<span className="text-primary">SMP</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
              >
                {link.name}
              </a>
            ))}
            <Button
              onClick={() => window.open("https://discord.gg/godlexsmp", "_blank")}
              className="bg-primary hover:bg-primary/90 text-white border-0 shadow-lg shadow-primary/20"
            >
              Play Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/80 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav absolute top-full left-0 right-0 border-t border-white/10 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1 shadow-2xl">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-lg text-base font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 px-3">
              <Button
                onClick={() => {
                  window.open("https://discord.gg/godlexsmp", "_blank");
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Play Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

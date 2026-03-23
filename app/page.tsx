"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Scroll Animation Hook (enhanced with staggered feature cards) ─── */

function useScrollAnimation() {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const featureCards = document.querySelectorAll(".feature-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Find index among siblings for stagger
            const card = entry.target as HTMLElement;
            const delay = parseFloat(card.dataset.stagger || "0") * 100;
            setTimeout(() => {
              card.classList.add("is-visible");
            }, delay);
            cardObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    featureCards.forEach((el) => cardObserver.observe(el));

    return () => {
      observer.disconnect();
      cardObserver.disconnect();
    };
  }, []);
}

/* ─── Scroll Progress Hook ─── */

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

/* ─── Parallax Hook ─── */

function useParallax() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const scrollY = window.scrollY;
            ref.current.style.transform = `translateY(${scrollY * 0.08}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return ref;
}

/* ─── Counter Animation Hook ─── */

function useCountUp(
  target: number,
  suffix: string,
  duration: number = 1500
): [React.RefObject<HTMLDivElement | null>, string] {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(`0${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const startTime = performance.now();

            const animate = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.round(eased * target);
              setDisplay(`${current}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration]);

  return [ref, display];
}

/* ─── Floating Particles Component ─── */

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    left: string;
    bottom: string;
    size: string;
    opacity: number;
    duration: string;
    delay: string;
    drift: string;
  }>>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 25 }, () => ({
      left: `${Math.random() * 100}%`,
      bottom: `${Math.random() * -20}%`,
      size: `${1 + Math.random() * 2.5}px`,
      opacity: 0.1 + Math.random() * 0.3,
      duration: `${10 + Math.random() * 18}s`,
      delay: `${Math.random() * 15}s`,
      drift: `${-30 + Math.random() * 60}px`,
    })));
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            ["--particle-size" as string]: p.size,
            ["--particle-opacity" as string]: p.opacity,
            ["--particle-duration" as string]: p.duration,
            ["--particle-delay" as string]: p.delay,
            ["--particle-drift" as string]: p.drift,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Phone Mockup Components ─── */

function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex-shrink-0 w-[260px] h-[540px] rounded-[2.5rem] bg-[#1a1a1a] border-[3px] border-[#2a2a2a] shadow-[0_0_60px_rgba(200,169,110,0.08),0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-[#1a1a1a] rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-[50px] h-[4px] bg-[#2a2a2a] rounded-full mt-1" />
      </div>
      {/* Screen */}
      <div className="absolute inset-[3px] rounded-[2.2rem] overflow-hidden bg-[#0A0A0A]">
        {children}
      </div>
    </div>
  );
}

function MockupKrewFeed() {
  return (
    <div className="animate-phone-float-delayed order-1">
      <PhoneFrame className="relative z-0 rotate-[-6deg] scale-[0.88] translate-x-[20px]">
        <div className="h-full flex flex-col text-white text-[10px]">
          {/* Status bar spacer */}
          <div className="h-8" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2">
            <span className="font-bold text-[14px] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-white">K</span>
              <span className="text-[var(--color-gold)]">REW</span>
            </span>
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute -top-1 -right-1 w-[8px] h-[8px] rounded-full bg-[var(--color-gold)]" />
            </div>
          </div>

          {/* Stories */}
          <div className="flex gap-3 px-4 py-2 overflow-hidden">
            {[
              { name: "Moi", color: "var(--color-gold)" },
              { name: "Sophie", color: "#8B5CF6" },
              { name: "Thomas", color: "#3B82F6" },
              { name: "Léa", color: "#EC4899" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`,
                    border: i === 0 ? "2px dashed rgba(255,255,255,0.3)" : `2px solid ${s.color}`,
                  }}
                >
                  {i === 0 ? "+" : s.name[0]}
                </div>
                <span className="text-[8px] text-white/50">{s.name}</span>
              </div>
            ))}
          </div>

          {/* Compose bar */}
          <div className="mx-4 my-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/25 text-[9px]">
            Quoi de neuf ?
          </div>

          {/* Post card */}
          <div className="mx-4 mt-1 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#EC5B13] to-[#EC5B13]/60 flex items-center justify-center text-[10px] font-bold">
                M
              </div>
              <div>
                <div className="font-semibold text-[9px] text-white/90">MALIK BENDJELLOUL</div>
                <div className="text-[7px] text-white/30">DOP &middot; il y a 3h</div>
              </div>
            </div>
            <div className="inline-block px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[8px] font-semibold mb-2">
              RECHERCHE TECHNICIEN
            </div>
            <p className="text-[9px] text-white/50 leading-relaxed">
              Cherche un Chef Elec dispo pour un court-métrage le 15 avril. 3 jours, Paris.
            </p>
            {/* Actions */}
            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/[0.05]">
              <span className="text-white/30">🤙 12</span>
              <span className="text-white/30">💬 4</span>
              <span className="text-white/30">↗ 2</span>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 px-4 mt-3 overflow-hidden">
            {["Tout", "Publi", "Artistes", "Technicien", "Wrap"].map((c, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 rounded-full text-[8px] font-medium flex-shrink-0 ${
                  i === 0
                    ? "bg-[var(--color-gold)] text-[var(--color-dark)]"
                    : "bg-white/[0.05] text-white/40"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

function MockupProjectDashboard() {
  return (
    <div className="animate-phone-float order-2" style={{ position: 'relative', zIndex: 10 }}>
      <PhoneFrame className="relative z-20 scale-[1.15] shadow-[0_0_80px_rgba(200,169,110,0.12),0_30px_60px_rgba(0,0,0,0.6)]">
        <div className="h-full flex flex-col text-white text-[10px]">
          {/* Status bar spacer */}
          <div className="h-8" />

          {/* Project header */}
          <div className="px-4 pt-2 pb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[7px] text-white/30 uppercase tracking-widest font-semibold">Projet</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[8px] font-semibold">
                PRÉ-PRODUCTION
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-black tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                ECLIPSE
              </h2>
              <div className="flex items-center gap-1">
                <span className="text-[20px] font-black text-[var(--color-gold)]" style={{ fontFamily: "var(--font-display)" }}>
                  J-12
                </span>
              </div>
            </div>
          </div>

          {/* Team avatars */}
          <div className="px-4 mb-3">
            <div className="text-[8px] text-white/30 uppercase tracking-wider font-semibold mb-2">Équipe</div>
            <div className="flex -space-x-2">
              {[
                { bg: "#8B5CF6", letter: "S" },
                { bg: "#3B82F6", letter: "T" },
                { bg: "#EC4899", letter: "L" },
                { bg: "#EC5B13", letter: "M" },
                { bg: "#10B981", letter: "A" },
              ].map((a, i) => (
                <div
                  key={i}
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#0A0A0A]"
                  style={{ backgroundColor: a.bg }}
                >
                  {a.letter}
                </div>
              ))}
              <div className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[9px] font-semibold border-2 border-[#0A0A0A] bg-white/10 text-white/50">
                +3
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2 px-4 mb-3">
            {[
              { icon: "💬", label: "Chat", count: "3" },
              { icon: "📄", label: "Documents", count: "12" },
              { icon: "📅", label: "Planning", count: "" },
              { icon: "🔧", label: "Équipement", count: "5" },
            ].map((a, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2"
              >
                <span className="text-[14px]">{a.icon}</span>
                <div>
                  <div className="text-[9px] font-semibold text-white/80">{a.label}</div>
                  {a.count && (
                    <div className="text-[7px] text-[var(--color-gold)]">{a.count} nouveau{a.count !== "1" ? "x" : ""}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div className="px-4 flex-1">
            <div className="text-[8px] text-white/30 uppercase tracking-wider font-semibold mb-2">Activité</div>
            <div className="space-y-2">
              {[
                { avatar: "L", color: "#EC4899", text: "Léa a uploadé le script v3", time: "il y a 2h" },
                { avatar: "T", color: "#3B82F6", text: "Thomas a confirmé les dates", time: "il y a 5h" },
                { avatar: "S", color: "#8B5CF6", text: "Sophie a validé le budget", time: "hier" },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ backgroundColor: a.color }}
                  >
                    {a.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] text-white/60 truncate">{a.text}</div>
                    <div className="text-[7px] text-white/25">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

function MockupStoryViewer() {
  return (
    <div className="animate-phone-float-delayed order-3" style={{ position: 'relative', zIndex: -1 }}>
      <PhoneFrame className="relative -z-10 rotate-[6deg] scale-[0.88] -translate-x-[40px]">
        <div className="h-full flex flex-col relative">
          {/* Gradient background — deep blue to dark teal */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2847] via-[#0D3B4F] to-[#0A2F3A]" />

          {/* Content overlay */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Status bar spacer */}
            <div className="h-8" />

            {/* Progress bars */}
            <div className="flex gap-1 px-4 pt-1 mb-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-1 h-[2px] rounded-full bg-white/20 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i < 1
                        ? "bg-white w-full"
                        : i === 1
                        ? "bg-white w-[60%]"
                        : "bg-transparent w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* User info */}
            <div className="flex items-center gap-2 px-4 mb-auto">
              <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold)]/60 flex items-center justify-center text-[11px] font-bold text-[var(--color-dark)]">
                S
              </div>
              <div>
                <span className="text-[10px] font-semibold text-white">Sophie Marceau</span>
                <span className="text-[8px] text-white/50 ml-2">il y a 2h</span>
              </div>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              {/* Decorative film icon */}
              <div className="text-[40px] mb-4 opacity-80">🎬</div>
              <p className="text-[14px] font-semibold text-white leading-snug mb-4" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
                <span className="text-[var(--color-gold)]">@ThomasV</span> merci pour cette journée incroyable 🎬
              </p>

              {/* Tag pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                <div className="w-[18px] h-[18px] rounded-full bg-[#3B82F6] flex items-center justify-center text-[8px] font-bold">
                  T
                </div>
                <span className="text-[9px] font-medium text-white">Thomas V.</span>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex items-center gap-3 px-4 pb-6 pt-3">
              <div className="flex-1 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] text-white/40">
                Envoyer un message...
              </div>
              <div className="w-[32px] h-[32px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-[14px]">❤️</span>
              </div>
            </div>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ─── Main Page ─── */

export default function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize scroll animation observer
  useScrollAnimation();

  // Scroll progress bar
  const scrollProgress = useScrollProgress();

  // Parallax for phone mockups
  const parallaxRef = useParallax();

  // Counter animations
  const [counterRef1, count1] = useCountUp(50, "+", 1500);
  const [counterRef2, count2] = useCountUp(13, "", 1500);
  const [counterRef3, count3] = useCountUp(100, "%", 1500);

  // Hero word animation data
  const heroWords = [
    { text: "Votre", gold: false },
    { text: "équipe.", gold: false },
    { text: "Votre", gold: false },
    { text: "tournage.", gold: false },
    { text: "Une seule", gold: true },
    { text: "app.", gold: true },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: Connect to Supabase or email service
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark)] relative overflow-hidden">
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Cinema light beam */}
      <div className="cinema-beam" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--color-accent)] opacity-[0.02] blur-[180px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 nav-logo-shimmer cursor-default">
          <span className="font-[var(--font-display)] text-2xl font-black tracking-tight">
            <span className="text-white">FILM</span>{" "}
            <span className="gold-text text-[var(--color-gold)]">KREW</span>
          </span>
        </div>
        <a
          href="#beta"
          className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-gold-light)] transition-colors"
        >
          Rejoindre la Beta
        </a>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Hero text — left side (40% on desktop) */}
          <div className="lg:w-[42%] lg:flex-shrink-0">
            <div className="badge-entrance inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
              <span className="text-[var(--color-gold)] text-xs font-semibold tracking-wide uppercase">
                Beta ouverte — Places limitées
              </span>
            </div>

            <h1 className="font-[var(--font-display)] text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              {heroWords.map((word, i) => {
                const isGold = word.gold;
                const isLineBreak = i === 1 || i === 3;
                return (
                  <span key={i}>
                    <span
                      className={`hero-word ${isGold ? "gold-shimmer" : ""}`}
                      style={{ animationDelay: `${0.4 + i * 0.2}s` }}
                    >
                      {word.text}
                    </span>
                    {isLineBreak ? (
                      <>
                        {" "}
                        <br className="hidden md:block" />
                      </>
                    ) : (
                      " "
                    )}
                  </span>
                );
              })}
            </h1>

            <p className="subtitle-entrance text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mb-10">
              Film KREW réunit tous les outils dont une équipe de tournage a besoin
              — projets, planning, communication, documents — dans une app conçue
              sur le plateau, pour le plateau.
            </p>

            <a
              href="#beta"
              className="cta-entrance inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] font-bold text-base hover:bg-[var(--color-gold-light)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Demander un accès
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Phone mockups — right side (58% on desktop) */}
          <div
            ref={parallaxRef}
            className="hidden lg:flex items-center justify-center lg:w-[58%] gap-[-8px] phone-entrance parallax-phones"
          >
            <MockupKrewFeed />
            <MockupProjectDashboard />
            <MockupStoryViewer />
          </div>
        </div>

        {/* Phone mockups — horizontal scroll (mobile/tablet) */}
        <div className="lg:hidden mt-14 -mx-6 px-6 overflow-x-auto">
          <div className="flex items-center gap-6 pb-4 w-max">
            <MockupKrewFeed />
            <MockupProjectDashboard />
            <MockupStoryViewer />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "🎬",
              title: "Projets",
              desc: "Créez et gérez vos projets de film. Équipe, planning, budget — tout au même endroit.",
            },
            {
              icon: "💬",
              title: "Communication",
              desc: "Channels par projet, DMs, annonces. Fini les groupes WhatsApp qui explosent.",
            },
            {
              icon: "📋",
              title: "Documents",
              desc: "FDS, contrats, droits à l'image. Créez, signez et partagez depuis l'app.",
            },
            {
              icon: "👥",
              title: "Réseau KREW",
              desc: "Connectez-vous avec votre équipe. Feed social, stories, talent directory.",
            },
            {
              icon: "🔧",
              title: "50+ Outils Pro",
              desc: "Calculateurs DOP, gestion équipement, rapports, météo plateau — 13 départements couverts.",
            },
            {
              icon: "🔔",
              title: "Notifications",
              desc: "Recherches de techniciens et talents. Soyez alerté quand votre réseau recrute.",
            },
          ].map((f, i) => (
            <div
              key={i}
              data-stagger={i}
              className="feature-card group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] cursor-default"
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="font-[var(--font-display)] text-lg font-bold mb-2">
                {f.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="animate-on-scroll relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-black text-center mb-12">
          Comment ça <span className="text-[var(--color-gold)]">marche</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-4xl mx-auto">
          {[
            {
              num: "1",
              title: "Créez votre projet",
              desc: "Définissez les infos clés : titre, dates, équipe, départements.",
              icon: "🎬",
            },
            {
              num: "2",
              title: "Invitez votre KREW",
              desc: "Ajoutez vos collaborateurs. Chacun retrouve son rôle et ses outils.",
              icon: "👥",
            },
            {
              num: "3",
              title: "Tournez sereinement",
              desc: "Planning, chat, documents, outils — tout est prêt pour le jour J.",
              icon: "🎥",
            },
          ].map((step, i) => (
            <div
              key={i}
              className={`relative text-center ${i < 2 ? "step-connector" : ""}`}
            >
              {/* Number */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 mb-5">
                <span className="font-[var(--font-display)] text-2xl font-black text-[var(--color-gold)]">
                  {step.num}
                </span>
              </div>
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="font-[var(--font-display)] text-lg font-bold mb-2">
                {step.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-[260px] mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof — animated counters */}
      <section className="animate-on-scroll relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 text-center">
          {[
            { ref: counterRef1, display: count1, label: "Outils pro" },
            { ref: counterRef2, display: count2, label: "Départements ciné" },
            { ref: counterRef3, display: count3, label: "Gratuit en beta" },
          ].map((s, i) => (
            <div key={i} ref={s.ref}>
              <div className="counter-value font-[var(--font-display)] text-4xl md:text-5xl font-black text-[var(--color-gold)]">
                {s.display}
              </div>
              <div className="text-white/30 text-sm mt-1 uppercase tracking-wider font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beta signup */}
      <section id="beta" className="animate-on-scroll relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="max-w-lg mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="text-center">
              <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-black mb-4">
                Rejoignez le <span className="gold-shimmer">KREW</span>
              </h2>
              <p className="text-white/40 mb-8">
                Inscrivez-vous pour un accès anticipé. Places limitées.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20">
                <span className="text-4xl mb-4 block text-center">🎬</span>
                <h3 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-gold)] mb-2 text-center">
                  Bienvenue dans le KREW !
                </h3>
                <p className="text-white/50 text-sm text-center">
                  On vous envoie un accès très bientôt. Gardez un oeil sur votre boîte mail.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-white/25 focus:outline-none focus:border-[var(--color-gold)]/40 focus:bg-white/[0.07] transition-all text-sm"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 focus:outline-none focus:border-[var(--color-gold)]/40 transition-all text-sm appearance-none"
                >
                  <option value="" className="bg-[var(--color-dark)]">Votre rôle sur le plateau</option>
                  <option value="realisation" className="bg-[var(--color-dark)]">Réalisation</option>
                  <option value="image" className="bg-[var(--color-dark)]">Image / DOP</option>
                  <option value="lumiere" className="bg-[var(--color-dark)]">Lumière / Électricité</option>
                  <option value="son" className="bg-[var(--color-dark)]">Son</option>
                  <option value="machinerie" className="bg-[var(--color-dark)]">Machinerie / Grip</option>
                  <option value="production" className="bg-[var(--color-dark)]">Production / Régie</option>
                  <option value="deco" className="bg-[var(--color-dark)]">Décor / Accessoires</option>
                  <option value="hmc" className="bg-[var(--color-dark)]">HMC (Habillage, Maquillage, Coiffure)</option>
                  <option value="postprod" className="bg-[var(--color-dark)]">Post-Production</option>
                  <option value="talent" className="bg-[var(--color-dark)]">Comédien·ne / Talent</option>
                  <option value="autre" className="bg-[var(--color-dark)]">Autre</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="animate-subtle-pulse w-full px-6 py-4 rounded-xl bg-[var(--color-gold)] text-[var(--color-dark)] font-bold text-base hover:bg-[var(--color-gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Envoi..." : "Demander un accès Beta"}
                </button>
                <p className="text-white/20 text-xs text-center">
                  Pas de spam. Juste un accès quand c'est prêt.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] mt-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-display)] text-sm font-bold">
              <span className="text-white/60">FILM</span>{" "}
              <span className="text-[var(--color-gold)]/60">KREW</span>
            </span>
            <span className="text-white/20 text-xs">&copy; 2026</span>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-xs">
            <span>filmkrew.app</span>
            <span>Conçu à Lyon &amp; Montréal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

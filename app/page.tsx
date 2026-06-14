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

    // Scroll-triggered slide animations
    const slideElements = document.querySelectorAll(".slide-in-left, .slide-in-right");
    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            slideObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    // Cinematic phone reveal (delayed 1.5s for title animation to finish)
    const cinematicPhones = document.querySelectorAll(".phone-cinematic, .phone-cinematic-left, .phone-cinematic-right");
    const phoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("revealed");
            }, 1500);
            phoneObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    featureCards.forEach((el) => cardObserver.observe(el));
    slideElements.forEach((el) => slideObserver.observe(el));
    cinematicPhones.forEach((el) => phoneObserver.observe(el));

    return () => {
      observer.disconnect();
      cardObserver.disconnect();
      slideObserver.disconnect();
      phoneObserver.disconnect();
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

/* ─── Feature Phone Scroll Parallax ─── */
function useFeatureParallax() {
  useEffect(() => {
    let ticking = false;
    const phones = document.querySelectorAll<HTMLElement>(".feature-phone-parallax");
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          phones.forEach((phone) => {
            const rect = phone.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const viewCenter = window.innerHeight / 2;
            const offset = (center - viewCenter) * 0.12;
            phone.style.transform = `translateY(${-offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* ─── Cursor Parallax Hook for 3D phone tilt ─── */

function useCursorParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const phones = phonesRef.current;
    if (!container || !phones) return;

    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize to -1..1
        const nx = (e.clientX - centerX) / (rect.width / 2);
        const ny = (e.clientY - centerY) / (rect.height / 2);

        // Clamp
        const clampedX = Math.max(-1, Math.min(1, nx));
        const clampedY = Math.max(-1, Math.min(1, ny));

        // Rotate opposite direction, max 5deg
        const rotateY = clampedX * -5;
        const rotateX = clampedY * 5;

        phones.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      });
    };

    const onMouseLeave = () => {
      cancelAnimationFrame(rafId);
      phones.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return { containerRef, phonesRef };
}

/* ─── Counter Animation Hook ─── */

function useCountUp(
  target: number,
  suffix: string,
  duration: number = 800
): [React.RefObject<HTMLDivElement | null>, string] {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(`0${suffix}`);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId: number;

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
                rafId = requestAnimationFrame(animate);
              } else {
                // Ensure final value is always set
                setDisplay(`${target}${suffix}`);
              }
            };

            rafId = requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      // Force final value on cleanup
      if (hasAnimated.current) {
        setDisplay(`${target}${suffix}`);
      }
    };
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
  scale = "normal",
}: {
  children: React.ReactNode;
  className?: string;
  scale?: "normal" | "large";
}) {
  const sizes = scale === "large"
    ? "w-[300px] h-[560px] md:w-[320px] md:h-[600px]"
    : "w-[260px] h-[540px]";

  return (
    <div
      className={`relative flex-shrink-0 ${sizes} rounded-[2.5rem] bg-[#1a1a1a] border-[3px] border-[#2a2a2a] shadow-[0_0_60px_rgba(200,169,110,0.08),0_25px_50px_rgba(0,0,0,0.5)] overflow-hidden ${className}`}
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

function MockupKrewFeed({ large = false }: { large?: boolean }) {
  return (
    <PhoneFrame scale={large ? "large" : "normal"} className={large ? "" : "relative rotate-[-6deg] scale-[0.88]"}>
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

        {/* Second post card */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/60 flex items-center justify-center text-[10px] font-bold">
              S
            </div>
            <div>
              <div className="font-semibold text-[9px] text-white/90">SOPHIE MARCEAU</div>
              <div className="text-[7px] text-white/30">Réalisatrice &middot; il y a 6h</div>
            </div>
          </div>
          <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[8px] font-semibold mb-2">
            WRAP
          </div>
          <p className="text-[9px] text-white/50 leading-relaxed">
            C'est un wrap sur ECLIPSE ! Merci a toute l'equipe 🎬🙏
          </p>
          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-white/[0.05]">
            <span className="text-white/30">🤙 34</span>
            <span className="text-white/30">💬 12</span>
            <span className="text-white/30">↗ 8</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function MockupProjectDashboard({ large = false }: { large?: boolean }) {
  return (
    <PhoneFrame scale={large ? "large" : "normal"} className={large ? "" : "relative scale-[1.15] shadow-[0_0_80px_rgba(200,169,110,0.12),0_30px_60px_rgba(0,0,0,0.6)]"}>
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
              { avatar: "M", color: "#EC5B13", text: "Malik a ajouté la shotlist", time: "hier" },
              { avatar: "A", color: "#10B981", text: "Ahmed a réservé le matériel", time: "il y a 2j" },
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
  );
}

function MockupStoryViewer() {
  return (
    <PhoneFrame className="relative rotate-[6deg] scale-[0.88]">
      <div className="h-full flex flex-col relative">
        {/* Gradient background */}
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
  );
}

/* ─── Chat Mockup for Feature Section 3 ─── */

function MockupChat() {
  return (
    <PhoneFrame scale="large">
      <div className="h-full flex flex-col text-white text-[10px]">
        {/* Status bar spacer */}
        <div className="h-8" />

        {/* Chat header */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-50">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-[11px] font-bold">
            E
          </div>
          <div>
            <div className="font-semibold text-[11px]">ECLIPSE — Lumière</div>
            <div className="text-[8px] text-white/30">8 membres</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-3 space-y-3 overflow-hidden">
          {/* Incoming */}
          <div className="flex gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#8B5CF6] flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-1">S</div>
            <div>
              <div className="text-[8px] text-white/40 mb-0.5">Sophie &middot; Chef Elec</div>
              <div className="px-3 py-2 rounded-2xl rounded-tl-md bg-white/[0.06] text-[10px] text-white/70 max-w-[200px]">
                Le 5K est dispo demain. On prend le kit complet ou juste les mandarines ?
              </div>
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="px-3 py-2 rounded-2xl rounded-tr-md bg-[var(--color-gold)]/20 text-[10px] text-white/80 max-w-[200px]">
              Kit complet + les 2 sky panels SVP 🙏
            </div>
          </div>

          {/* Incoming */}
          <div className="flex gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#3B82F6] flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-1">T</div>
            <div>
              <div className="text-[8px] text-white/40 mb-0.5">Thomas &middot; DOP</div>
              <div className="px-3 py-2 rounded-2xl rounded-tl-md bg-white/[0.06] text-[10px] text-white/70 max-w-[200px]">
                Parfait. J'ai partagé la FDS mise à jour dans Documents
              </div>
            </div>
          </div>

          {/* Document attachment */}
          <div className="flex gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#3B82F6] flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-1">T</div>
            <div className="px-3 py-2 rounded-2xl rounded-tl-md bg-white/[0.06] max-w-[200px]">
              <div className="flex items-center gap-2">
                <div className="w-[28px] h-[28px] rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center text-[12px]">📄</div>
                <div>
                  <div className="text-[9px] font-semibold text-white/80">FDS_Eclipse_v2.pdf</div>
                  <div className="text-[7px] text-white/30">1.2 MB</div>
                </div>
              </div>
            </div>
          </div>

          {/* Incoming */}
          <div className="flex gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#EC4899] flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-1">L</div>
            <div>
              <div className="text-[8px] text-white/40 mb-0.5">Léa &middot; Réalisatrice</div>
              <div className="px-3 py-2 rounded-2xl rounded-tl-md bg-white/[0.06] text-[10px] text-white/70 max-w-[200px]">
                Merci l'équipe, on est bons pour demain 🎬
              </div>
            </div>
          </div>

          {/* Outgoing */}
          <div className="flex justify-end">
            <div className="px-3 py-2 rounded-2xl rounded-tr-md bg-[var(--color-gold)]/20 text-[10px] text-white/80 max-w-[200px]">
              RDV 6h30 sur le plateau 👊
            </div>
          </div>

          {/* Incoming */}
          <div className="flex gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#10B981] flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-1">A</div>
            <div>
              <div className="text-[8px] text-white/40 mb-0.5">Ahmed &middot; Régisseur</div>
              <div className="px-3 py-2 rounded-2xl rounded-tl-md bg-white/[0.06] text-[10px] text-white/70 max-w-[200px]">
                Catering confirmé, on aura café dès 6h ☕
              </div>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2">
          <div className="w-[28px] h-[28px] rounded-full bg-white/[0.06] flex items-center justify-center">
            <span className="text-[12px]">+</span>
          </div>
          <div className="flex-1 px-3 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] text-white/25">
            Message...
          </div>
          <div className="w-[28px] h-[28px] rounded-full bg-[var(--color-gold)] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-dark)" strokeWidth="2.5">
              <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ─── Testimonial Card ─── */

function TestimonialCard({
  quote,
  name,
  role,
  delay,
}: {
  quote: string;
  name: string;
  role: string;
  delay: number;
}) {
  return (
    <div
      className="testimonial-card flex-shrink-0 w-[340px] md:w-auto md:flex-1 p-6 md:p-8 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[var(--color-gold)]/20 transition-colors"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Quote mark */}
      <div className="text-[var(--color-gold)] text-4xl leading-none mb-3 opacity-40 font-[var(--font-display)]">&ldquo;</div>

      <p className="text-white/60 text-[15px] leading-relaxed mb-6">{quote}</p>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)" className="opacity-80">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <div>
        <div className="font-semibold text-[var(--color-gold)] text-sm">{name}</div>
        <div className="text-white/30 text-xs">{role}</div>
      </div>
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

  // Parallax for phone mockups (scroll-based)
  const parallaxRef = useParallax();
  useFeatureParallax();

  // Cursor-based 3D parallax for hero phones
  const { containerRef: heroContainerRef, phonesRef: heroPhonesRef } = useCursorParallax();

  // Counter animations
  const [counterRef1, count1] = useCountUp(50, "+", 800);
  const [counterRef2, count2] = useCountUp(13, "", 800);
  const [counterRef3, count3] = useCountUp(100, "%", 800);

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
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="https://filmkrew-app.web.app"
            className="inline-flex px-4 md:px-5 py-2.5 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold)] text-sm font-semibold hover:bg-[var(--color-gold)]/10 transition-colors"
          >
            Se connecter
          </a>
          <a
            href="#beta"
            className="hidden md:inline-flex px-5 py-2.5 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] text-sm font-semibold hover:bg-[var(--color-gold-light)] transition-colors"
          >
            Rejoindre la Beta
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════ */}
      {/* HERO                                           */}
      {/* ═══════════════════════════════════════════════ */}
      <section ref={heroContainerRef} className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-14 pb-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Hero text — left side */}
          <div className="lg:w-[42%] lg:flex-shrink-0">
            <div className="badge-entrance inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
              <span className="text-[var(--color-gold)] text-xs font-semibold tracking-wide uppercase">
                Beta ouverte — Places limitées
              </span>
            </div>

            <h1 className="font-[var(--font-display)] text-6xl md:text-8xl lg:text-9xl font-black leading-[0.95] tracking-tight mb-6">
              {heroWords.map((word, i) => {
                const isGold = word.gold;
                const isLineBreak = i === 1 || i === 3;
                return (
                  <span key={i}>
                    <span
                      className={`hero-word ${isGold ? "hero-gold-gradient" : ""}`}
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

            <p className="subtitle-entrance text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mb-4">
              Film KREW réunit tous les outils dont une équipe de tournage a besoin
              — projets, planning, communication, documents — dans une app conçue
              sur le plateau, pour le plateau.
            </p>

            {/* Platform availability line */}
            <div className="subtitle-entrance flex items-center gap-2 mb-6 text-white/30 text-sm">
              <span>Disponible sur iOS</span>
              <span className="text-base"></span>
              <span>et Android</span>
              <span className="text-base">🤖</span>
            </div>

            <a
              href="#beta"
              className="cta-entrance inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] font-bold text-base hover:bg-[var(--color-gold-light)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Demander un accès
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <p className="cta-entrance mt-4 text-sm text-white/40">
              Déjà membre ?{" "}
              <a
                href="https://filmkrew-app.web.app"
                className="text-[var(--color-gold)] font-semibold hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>

          {/* Phone mockups — right side (desktop: 3 phones with cursor parallax) */}
          <div
            className="hidden lg:flex items-center justify-center lg:w-[58%]"
          >
            <div ref={heroPhonesRef} className="flex items-center justify-center cursor-parallax-phones">
              <div className="phone-cinematic-left" style={{ marginRight: '-40px' }}>
                <MockupKrewFeed />
              </div>
              <div className="phone-cinematic">
                <MockupProjectDashboard />
              </div>
              <div className="phone-cinematic-right" style={{ marginLeft: '-40px' }}>
                <MockupStoryViewer />
              </div>
            </div>
          </div>
        </div>

        {/* Phone mockups — mobile: single center phone only */}
        <div className="lg:hidden mt-8 flex justify-center phone-entrance">
          <div className="animate-phone-float">
            <MockupProjectDashboard />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FEATURE SECTIONS (3 large alternating)         */}
      {/* ═══════════════════════════════════════════════ */}

      {/* Feature 1: Gérez vos projets — mockup left, text right */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Mockup */}
          <div className="slide-in-left lg:w-1/2 flex justify-center feature-phone-parallax">
            <div className="relative">
              <div className="absolute -inset-20 bg-[var(--color-gold)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
              <MockupProjectDashboard large />
            </div>
          </div>
          {/* Text */}
          <div className="slide-in-right lg:w-1/2">
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl font-black mb-8 leading-tight">
              Gérez vos{" "}
              <span className="text-[var(--color-gold)]">projets</span>
            </h2>
            <div className="space-y-5">
              {[
                { icon: "🎬", text: "Créez et organisez vos projets", sub: "Court-métrage, long, série, clip — tous les formats" },
                { icon: "👥", text: "Invitez votre équipe par département", sub: "Image, lumière, son, déco, HMC et plus" },
                { icon: "📅", text: "Planning, budget, phases de production", sub: "De la pré-prod à la post-prod" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-white/50 text-lg leading-relaxed group-hover:text-white/70 transition-colors">
                      {item.text}
                    </p>
                    <p className="text-sm text-white/30 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Votre réseau KREW — text left, mockup right */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          {/* Mockup */}
          <div className="slide-in-right lg:w-1/2 flex justify-center feature-phone-parallax">
            <div className="relative">
              <div className="absolute -inset-20 bg-[var(--color-accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
              <MockupKrewFeed large />
            </div>
          </div>
          {/* Text */}
          <div className="slide-in-left lg:w-1/2">
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl font-black mb-8 leading-tight">
              Votre réseau{" "}
              <span className="text-[var(--color-gold)]">KREW</span>
            </h2>
            <div className="space-y-5">
              {[
                { icon: "💬", text: "Feed social dédié au cinéma", sub: "Partagez vos projets et découvertes" },
                { icon: "🔍", text: "Recherche de techniciens et talents", sub: "Trouvez le bon profil dans votre réseau" },
                { icon: "📸", text: "Stories, mentions, réactions", sub: "Identifiez vos collaborateurs" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-white/50 text-lg leading-relaxed group-hover:text-white/70 transition-colors">
                      {item.text}
                    </p>
                    <p className="text-sm text-white/30 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Communication centralisée — mockup left, text right */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Mockup */}
          <div className="slide-in-left lg:w-1/2 flex justify-center feature-phone-parallax">
            <div className="relative">
              <div className="absolute -inset-20 bg-emerald-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />
              <MockupChat />
            </div>
          </div>
          {/* Text */}
          <div className="slide-in-right lg:w-1/2">
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl font-black mb-8 leading-tight">
              Communication{" "}
              <span className="text-[var(--color-gold)]">centralisée</span>
            </h2>
            <div className="space-y-5">
              {[
                { icon: "💬", text: "Channels par projet et département", sub: "Fini les 15 groupes WhatsApp" },
                { icon: "📩", text: "DMs avec partage de publications", sub: "Envoyez des posts directement en message" },
                { icon: "📋", text: "Documents, FDS, contrats", sub: "Tout centralisé, accessible hors-ligne" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-white/50 text-lg leading-relaxed group-hover:text-white/70 transition-colors">
                      {item.text}
                    </p>
                    <p className="text-sm text-white/30 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="animate-on-scroll relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
        <h2 className="font-[var(--font-display)] text-3xl md:text-5xl font-black text-center mb-8">
          Ce qu&apos;ils en{" "}
          <span className="text-[var(--color-gold)]">pensent</span>
        </h2>

        {/* Desktop: row, Mobile: horizontal scroll with snap */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
          <TestimonialCard
            quote="Film KREW a changé notre façon de communiquer sur le plateau. Plus besoin de 15 groupes WhatsApp."
            name="Claire Mathon"
            role="Directrice Photo"
            delay={0}
          />
          <TestimonialCard
            quote="Enfin une app pensée par des gens du milieu. Les outils DOP sont exactement ce qu'il me fallait."
            name="Romain Music"
            role="Chef Opérateur"
            delay={150}
          />
          <TestimonialCard
            quote="La recherche de techniciens via le réseau KREW nous a fait gagner un temps fou en pré-prod."
            name="Julie Gayet"
            role="Productrice"
            delay={300}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="animate-on-scroll relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
        <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-black text-center mb-10">
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

      {/* ═══════════════════════════════════════════════ */}
      {/* CTA BANNER                                     */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative z-10 my-8 mx-6 md:mx-12 lg:mx-auto max-w-7xl">
        <div className="cta-banner relative rounded-3xl overflow-hidden px-8 py-10 text-center">
          {/* Animated gradient border */}
          <div className="cta-banner-border" />

          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#1a1510] to-[#141414]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,110,0.08)_0%,transparent_70%)]" />

          <div className="relative z-10">
            <h2 className="font-[var(--font-display)] text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              Prêt à rejoindre le{" "}
              <span className="text-[var(--color-gold)]">KREW</span> ?
            </h2>
            <p className="text-white/40 text-lg md:text-xl mb-6 max-w-lg mx-auto">
              Inscrivez-vous maintenant et soyez parmi les premiers.
            </p>
            <a
              href="#beta"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] font-bold text-lg hover:bg-[var(--color-gold-light)] transition-all hover:scale-[1.02] active:scale-[0.98] animate-subtle-pulse"
            >
              Demander un accès
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Beta signup */}
      <section id="beta" className="animate-on-scroll relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
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

"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-gold)] opacity-[0.03] blur-[200px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[var(--color-accent)] opacity-[0.02] blur-[180px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="font-[var(--font-display)] text-2xl font-black tracking-tight">
            <span className="text-white">FILM</span>{" "}
            <span className="text-[var(--color-gold)]">KREW</span>
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
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
            <span className="text-[var(--color-gold)] text-xs font-semibold tracking-wide uppercase">
              Beta ouverte — Places limitées
            </span>
          </div>

          <h1 className="font-[var(--font-display)] text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
            Votre équipe.{" "}
            <br className="hidden md:block" />
            Votre tournage.{" "}
            <br className="hidden md:block" />
            <span className="text-[var(--color-gold)]">Une seule app.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-xl mb-10">
            Film KREW réunit tous les outils dont une équipe de tournage a besoin
            — projets, planning, communication, documents — dans une app conçue
            sur le plateau, pour le plateau.
          </p>

          <a
            href="#beta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] font-bold text-base hover:bg-[var(--color-gold-light)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Demander un accès
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[var(--color-gold)]/20 hover:bg-white/[0.05] transition-all duration-300"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-[var(--font-display)] text-lg font-bold mb-2">
                {f.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 text-center">
          {[
            { num: "50+", label: "Outils pro" },
            { num: "13", label: "Départements ciné" },
            { num: "100%", label: "Gratuit en beta" },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-[var(--font-display)] text-4xl md:text-5xl font-black text-[var(--color-gold)]">
                {s.num}
              </div>
              <div className="text-white/30 text-sm mt-1 uppercase tracking-wider font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beta signup */}
      <section id="beta" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-black mb-4">
            Rejoignez le <span className="text-[var(--color-gold)]">KREW</span>
          </h2>
          <p className="text-white/40 mb-8">
            Inscrivez-vous pour un accès anticipé. Places limitées.
          </p>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20">
              <span className="text-4xl mb-4 block">🎬</span>
              <h3 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-gold)] mb-2">
                Bienvenue dans le KREW !
              </h3>
              <p className="text-white/50 text-sm">
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
                className="w-full px-6 py-3.5 rounded-xl bg-[var(--color-gold)] text-[var(--color-dark)] font-bold text-sm hover:bg-[var(--color-gold-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Envoi..." : "Demander un accès Beta"}
              </button>
              <p className="text-white/20 text-xs">
                Pas de spam. Juste un accès quand c'est prêt.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-[var(--font-display)] text-sm font-bold">
              <span className="text-white/60">FILM</span>{" "}
              <span className="text-[var(--color-gold)]/60">KREW</span>
            </span>
            <span className="text-white/20 text-xs">© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-xs">
            <span>filmkrew.app</span>
            <span>Conçu à Lyon & Montréal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

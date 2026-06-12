"use client";

import { useEffect, useState } from "react";

/* ───────────────────────────────────────────────────────────────────────────
   Page d'invitation — atteinte via https://filmkrew.app/invite/<token>

   Trois rôles :
   1. Tuer le 404 (la route n'existait pas → Next renvoyait "page not found").
   2. Ouvrir l'app : bouton + auto-tentative sur mobile via le scheme custom
      `filmkrew://invite/<token>` (déclaré côté iOS CFBundleURLSchemes + Android
      intent-filter — il marche AUJOURD'HUI sans rebuild).
   3. Fallback propre : pas l'app installée → renvoi vers l'inscription beta.

   Quand les universal/app links seront actifs (fichiers .well-known hébergés +
   entitlement iOS), le tap sur le lien ouvrira l'app DIRECT sans passer par
   cette page — elle reste le filet de sécurité (desktop, app absente, expiré).
   ─────────────────────────────────────────────────────────────────────────── */

// Tokens produits par generate_invite_link_rpc : 32 caractères hex minuscules
// (encode(gen_random_bytes(16), 'hex')). Tout le reste = lien invalide.
const TOKEN_RE = /^[0-9a-f]{32}$/;
const BETA_URL = "/#beta";

export default function InviteClient({ token }: { token: string }) {
  const valid = TOKEN_RE.test(token);
  const appLink = `filmkrew://invite/${token}`;
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (!valid) return;
    // Auto-tentative d'ouverture de l'app sur mobile (le chargement de la page
    // sert de geste utilisateur). Sur desktop on ne tente rien : il n'y a pas
    // d'app, l'utilisateur lit la page et ouvre le lien depuis son téléphone.
    const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!isMobile) return;
    const t = setTimeout(() => {
      window.location.href = appLink;
      setAttempted(true);
    }, 700);
    return () => clearTimeout(t);
  }, [valid, appLink]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 py-16">
      <div className="w-full max-w-[440px]">
        {/* Wordmark */}
        <a
          href="/"
          className="mb-10 flex items-center justify-center gap-2.5 text-stone-900"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" width={28} height={28} aria-hidden />
          <span
            className="text-xl font-black tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Film KREW
          </span>
        </a>

        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          {valid ? (
            <ValidInvite appLink={appLink} attempted={attempted} />
          ) : (
            <InvalidInvite />
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-stone-400">
          Un souci pour rejoindre&nbsp;?{" "}
          <a
            href="mailto:akiki.zacarya@gmail.com"
            className="underline underline-offset-2 hover:text-orange-600"
          >
            akiki.zacarya@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}

function ValidInvite({
  appLink,
  attempted,
}: {
  appLink: string;
  attempted: boolean;
}) {
  return (
    <>
      <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.18em] text-orange-600">
        Invitation
      </p>
      <h1
        className="mb-3 text-center text-[28px] leading-tight font-bold tracking-tight text-stone-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Tu es invité·e à rejoindre une équipe
      </h1>
      <p className="mb-7 text-center text-[15px] leading-relaxed text-stone-600">
        Quelqu&apos;un t&apos;a ajouté·e à un projet sur Film Krew. Ouvre
        l&apos;app pour voir le projet et accepter.
      </p>

      <a
        href={appLink}
        className="block w-full rounded-xl bg-orange-600 py-3.5 text-center text-[15px] font-semibold text-white transition-colors hover:bg-orange-700"
      >
        Ouvrir dans Film Krew
      </a>

      <div className="mt-6 border-t border-stone-100 pt-6">
        <p className="mb-3 text-center text-[13px] text-stone-500">
          {attempted
            ? "Toujours rien&nbsp;? L'app n'est peut-être pas encore installée."
            : "Pas encore l'app&nbsp;?"}
        </p>
        <a
          href={BETA_URL}
          className="block w-full rounded-xl border border-stone-300 py-3 text-center text-[14px] font-semibold text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50"
        >
          Télécharger Film Krew
        </a>
      </div>
    </>
  );
}

function InvalidInvite() {
  return (
    <>
      <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.18em] text-stone-400">
        Invitation
      </p>
      <h1
        className="mb-3 text-center text-[26px] leading-tight font-bold tracking-tight text-stone-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Ce lien n&apos;est plus valide
      </h1>
      <p className="mb-7 text-center text-[15px] leading-relaxed text-stone-600">
        Le lien d&apos;invitation est incomplet, a expiré, ou a été révoqué.
        Demande à la personne qui t&apos;a invité·e de t&apos;en renvoyer un
        nouveau.
      </p>
      <a
        href={BETA_URL}
        className="block w-full rounded-xl border border-stone-300 py-3 text-center text-[14px] font-semibold text-stone-800 transition-colors hover:border-stone-400 hover:bg-stone-50"
      >
        Découvrir Film Krew
      </a>
    </>
  );
}

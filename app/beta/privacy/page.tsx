import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Film KREW Beta",
  description:
    "Comment Film KREW collecte, utilise et protège tes données pendant la beta privée. Bref, en français, RGPD-friendly.",
  robots: {
    index: true,
    follow: true,
  },
};

const updated = "19 mai 2026";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-12 md:py-16">
      <header className="mb-10">
        <a
          href="/"
          className="mb-6 inline-block text-sm text-stone-500 transition-colors hover:text-orange-600"
        >
          ← Retour au site
        </a>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-stone-400">
          Mise à jour : {updated} · Version Beta
        </p>
      </header>

      <p className="mb-6 leading-relaxed text-stone-700">
        Cette page décrit comment <strong>Film Krew</strong> (l&apos;«&nbsp;Application&nbsp;»)
        collecte, utilise et protège tes données. Elle est volontairement
        courte, en français, sans jargon. Pour toute question, écris-nous à{" "}
        <a
          href="mailto:akiki.zacarya@gmail.com"
          className="font-semibold text-orange-600 underline underline-offset-2"
        >
          akiki.zacarya@gmail.com
        </a>
        .
      </p>

      <div className="my-8 rounded-r-xl border-l-[3px] border-orange-600 bg-orange-50 p-4 text-sm leading-relaxed text-stone-700">
        <strong>En une phrase&nbsp;:</strong> on collecte le strict nécessaire
        pour faire marcher l&apos;app + détecter les bugs, on ne vend rien, on
        n&apos;envoie rien à des annonceurs, tu peux tout supprimer quand tu
        veux.
      </div>

      <Section title="Qui est responsable de tes données">
        <p>
          L&apos;éditeur de Film Krew est <strong>Zacarya Akiki</strong>
          {" "}(auto-entrepreneur, France). Pour exercer tes droits ou demander
          la suppression de tes données&nbsp;: <strong>akiki.zacarya@gmail.com</strong>.
        </p>
      </Section>

      <Section title="Ce qu&apos;on collecte (et pourquoi)">
        <h3 className="mb-2 mt-4 text-base font-semibold text-stone-900">
          Données que tu nous donnes explicitement
        </h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Identifiants de compte</strong>&nbsp;: email, mot de passe
            (hashé), nickname.{" "}
            <em>Pour te connecter et identifier ton compte.</em>
          </li>
          <li>
            <strong>Profil</strong>&nbsp;: nom affiché, bio, photo, rôles
            métier, liens (IMDb, etc.).{" "}
            <em>
              Pour que les autres membres puissent t&apos;identifier sur leurs
              projets.
            </em>
          </li>
          <li>
            <strong>Contenu projet</strong>&nbsp;: titres, dates, lieux,
            équipe, photos, fichiers, messages.{" "}
            <em>
              C&apos;est ton travail — on le stocke pour que tu y aies accès
              depuis tous tes appareils.
            </em>
          </li>
          <li>
            <strong>Feedback de beta</strong>&nbsp;: si tu utilises le bouton
            «&nbsp;Signaler un bug&nbsp;», ce que tu écris nous arrive
            directement.
          </li>
        </ul>

        <h3 className="mb-2 mt-6 text-base font-semibold text-stone-900">
          Données collectées automatiquement
        </h3>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Données techniques anonymisées</strong>&nbsp;: modèle
            d&apos;appareil, version OS, version de l&apos;app, type de
            réseau.{" "}
            <em>
              Pour diagnostiquer les crashs sans demander à chaque utilisateur.
            </em>
          </li>
          <li>
            <strong>Crashs et erreurs</strong> (via Sentry)&nbsp;: stack trace,
            écran où s&apos;est produit le bug. <em>Pour les réparer.</em>
            {" "}Aucun mot de passe, aucun contenu de message n&apos;est envoyé.
          </li>
          <li>
            <strong>Statistiques d&apos;usage anonymes</strong> (via Firebase
            Analytics)&nbsp;: écrans visités, actions clés (création de
            projet, etc.).{" "}
            <em>
              Pour comprendre ce qui marche et ce qui n&apos;est pas clair.
            </em>{" "}
            Pas de contenu, pas d&apos;identifiant publicitaire.
          </li>
        </ul>
      </Section>

      <Section title="Ce qu&apos;on ne fait PAS">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>On ne vend pas tes données.</strong> Jamais.
          </li>
          <li>Pas de pub, pas de tracking publicitaire, pas d&apos;IDFA.</li>
          <li>Pas de revente à des partenaires marketing.</li>
          <li>Pas de reconnaissance faciale, pas de profilage.</li>
        </ul>
      </Section>

      <Section title="Où sont stockées tes données">
        <p className="mb-2">Les serveurs sont hébergés en <strong>Union Européenne</strong>&nbsp;:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            Base de données et auth&nbsp;: <strong>Supabase</strong> (région
            Europe, Frankfurt).
          </li>
          <li>
            Crash reporting&nbsp;: <strong>Sentry</strong> (région Allemagne,
            sentry.io).
          </li>
          <li>
            Analytics&nbsp;: <strong>Firebase / Google Analytics</strong>
            {" "}(transferts hors UE possibles, encadrés par Google Standard
            Contractual Clauses).
          </li>
        </ul>
      </Section>

      <Section title="Combien de temps on les garde">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Compte actif</strong>&nbsp;: tant que tu utilises
            l&apos;app.
          </li>
          <li>
            <strong>Compte supprimé</strong>&nbsp;: 30 jours puis effacement
            définitif. Tu peux supprimer ton compte à tout moment depuis
            Réglages → Compte.
          </li>
          <li>
            <strong>Logs techniques (crashs)</strong>&nbsp;: 90 jours puis
            effacement automatique côté Sentry.
          </li>
          <li>
            <strong>Statistiques d&apos;usage</strong>&nbsp;: 14 mois maximum
            (paramètre par défaut Firebase).
          </li>
        </ul>
      </Section>

      <Section title="Tes droits (RGPD)">
        <p className="mb-2">Tu as à tout moment le droit de&nbsp;:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong>Accéder</strong> à tes données&nbsp;: demande par email.
          </li>
          <li>
            <strong>Corriger</strong> tes informations&nbsp;: directement dans
            l&apos;app, ou par email.
          </li>
          <li>
            <strong>Supprimer</strong> ton compte et tes données&nbsp;:
            Réglages → Compte → Supprimer le compte.
          </li>
          <li>
            <strong>Refuser</strong> le crash reporting et l&apos;analytics&nbsp;:
            Réglages → Confidentialité (à venir).
          </li>
          <li>
            <strong>Récupérer</strong> tes données sous forme exportable&nbsp;:
            demande par email.
          </li>
          <li>
            <strong>Te plaindre auprès de la CNIL</strong> si tu estimes
            qu&apos;on respecte mal tes droits&nbsp;:{" "}
            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 underline underline-offset-2"
            >
              cnil.fr
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section title="Sécurité">
        <ul className="ml-5 list-disc space-y-2">
          <li>Mots de passe hashés (jamais stockés en clair).</li>
          <li>Connexion chiffrée HTTPS + certificate pinning.</li>
          <li>Base de données locale chiffrée (SQLCipher).</li>
          <li>
            Détection root/jailbreak (freerasp) — l&apos;app refuse de tourner
            sur device compromis.
          </li>
          <li>Option 2FA (authentificateur TOTP) disponible.</li>
        </ul>
      </Section>

      <Section title="Beta privée — précisions">
        <p className="mb-2">
          Tu es en phase de <strong>beta privée</strong>. À ce stade&nbsp;:
        </p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            L&apos;app peut planter, perdre des données, ou avoir des bugs
            visuels — c&apos;est attendu.
          </li>
          <li>
            Les données envoyées via le bouton «&nbsp;Signaler un bug&nbsp;»
            sont lues manuellement par l&apos;équipe.
          </li>
          <li>
            On peut être amenés à te contacter par email pour préciser un bug.
          </li>
          <li>Tu peux quitter la beta à tout moment depuis TestFlight.</li>
        </ul>
      </Section>

      <Section title="Modifications de cette politique">
        <p>
          Si on change quelque chose d&apos;important, tu seras prévenu dans
          l&apos;app (popup au prochain lancement) ou par email. Cette page
          reflète toujours la version en vigueur.
        </p>
      </Section>

      <footer className="mt-12 border-t border-stone-200 pt-6 text-sm leading-relaxed text-stone-500">
        <p className="mb-1">
          <strong className="text-stone-700">
            Film Krew Beta · Version 1.0.0 (build 64)
          </strong>
        </p>
        <p className="mb-1">Contact&nbsp;: akiki.zacarya@gmail.com</p>
        <p>Politique en vigueur depuis le {updated}.</p>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 flex items-baseline text-xl font-semibold tracking-tight text-stone-900">
        <span className="mr-2 text-orange-600">—</span>
        {title}
      </h2>
      <div className="leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}

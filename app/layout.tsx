import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Film KREW — L'app des equipes de tournage",
  description:
    "Film KREW reunit tous les outils dont une equipe de tournage a besoin. Projets, planning, communication, documents — dans une app concue sur le plateau.",
  keywords: ["film", "krew", "tournage", "cinéma", "équipe", "production", "app"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Film KREW — L'app des equipes de tournage",
    description:
      "Film KREW reunit tous les outils dont une equipe de tournage a besoin. Projets, planning, communication, documents — dans une app concue sur le plateau.",
    url: "https://filmkrew.app",
    siteName: "Film KREW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

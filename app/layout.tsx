import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Film KREW — L'app des équipes de tournage",
  description: "Gérez vos projets, votre équipe et vos tournages depuis une seule app. Rejoignez la beta.",
  keywords: ["film", "krew", "tournage", "cinéma", "équipe", "production", "app"],
  openGraph: {
    title: "Film KREW — L'app des équipes de tournage",
    description: "Gérez vos projets, votre équipe et vos tournages depuis une seule app.",
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

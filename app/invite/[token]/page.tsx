import type { Metadata } from "next";
import InviteClient from "./invite-client";

export const metadata: Metadata = {
  title: "Invitation — Film KREW",
  description:
    "Tu as été invité·e à rejoindre une équipe sur Film Krew. Ouvre le lien dans l'app pour accepter.",
  // Les liens d'invitation contiennent un token — on n'indexe jamais ces pages.
  robots: { index: false, follow: false },
};

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <InviteClient token={token} />;
}

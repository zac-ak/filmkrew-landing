/**
 * iOS Universal Links — Apple App Site Association (AASA).
 *
 * Servi à https://filmkrew.app/.well-known/apple-app-site-association
 * (sans extension, content-type application/json forcé par Response.json).
 *
 * Permet à iOS d'ouvrir https://filmkrew.app/invite/* directement dans l'app.
 *
 * Prérequis côté app (sinon iOS ignore ce fichier) :
 *   1. Entitlement com.apple.developer.associated-domains = applinks:filmkrew.app
 *      (ajouté dans ios/Runner/Runner.entitlements).
 *   2. Capability « Associated Domains » activée sur l'App ID dans le portail
 *      Apple Developer + provisioning profile régénéré.
 *
 * appID = <App ID Prefix>.<bundle id>. L'App ID Prefix vaut le Team ID
 * (724379YJSV) pour cet App ID — à confirmer dans Apple Developer › Identifiers
 * (champ « App ID Prefix » affiché à côté du bundle id).
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: "724379YJSV.com.filmkrew.filmkrew",
          paths: ["/invite/*"],
        },
      ],
    },
  });
}

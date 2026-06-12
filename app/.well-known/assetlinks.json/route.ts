/**
 * Android App Links — Digital Asset Links.
 *
 * Servi à https://filmkrew.app/.well-known/assetlinks.json
 *
 * Permet à Android de vérifier (autoVerify="true" dans AndroidManifest.xml,
 * intent-filter https://filmkrew.app/invite/*) que l'app com.filmkrew.filmkrew
 * a le droit d'ouvrir les liens du domaine — sans dialogue de désambiguïsation.
 *
 * ⚠️ Empreinte = clé de signature de l'app TELLE QU'INSTALLÉE :
 *   - Install direct (APK / AAB signé localement) → clé release/upload ci-dessous.
 *   - Distribution via Google Play (Play App Signing) → Google re-signe avec SA
 *     clé. Il faut alors AJOUTER l'empreinte SHA256 de la « clé de signature de
 *     l'app » lue dans Play Console › Intégrité de l'app › Signature de l'app.
 *     Le tableau accepte plusieurs empreintes, on les empile.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.filmkrew.filmkrew",
        sha256_cert_fingerprints: [
          // Clé release/upload (keystore filmkrew-release.keystore, alias filmkrew)
          "17:A8:66:1D:A7:5C:65:2B:0B:64:B3:92:04:77:33:7A:6F:45:6E:7C:71:E7:6F:0B:C8:BE:02:CE:05:FC:48:C5",
          // TODO: ajouter ici l'empreinte « clé de signature de l'app » de Play
          // Console quand l'app est distribuée via Google Play.
        ],
      },
    },
  ]);
}

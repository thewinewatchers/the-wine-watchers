import Link from "next/link";

const SITE_URL = "https://www.thewinewatchers.com";

const seoLinks = [
  {
    title: "Accueil",
    url: `${SITE_URL}/`,
  },
  {
    title: "Boutique",
    url: `${SITE_URL}/boutique`,
  },
  {
    title: "Bordeaux",
    url: `${SITE_URL}/boutique/bordeaux`,
  },
  {
    title: "Bourgogne",
    url: `${SITE_URL}/boutique/bourgogne`,
  },
  {
    title: "Primeurs 2025",
    url: `${SITE_URL}/boutique/primeurs-2025`,
  },
  {
    title: "Blog",
    url: `${SITE_URL}/blog`,
  },
  {
    title: "Sitemap",
    url: `${SITE_URL}/sitemap.xml`,
  },
  {
    title: "Robots.txt",
    url: `${SITE_URL}/robots.txt`,
  },
];

export default function AdminSeoPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-sm text-amber-300 hover:text-amber-200"
          >
            ← Retour admin
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-amber-200">
            SEO & Indexation
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-neutral-300">
            Tableau de contrôle SEO pour vérifier rapidement les pages
            principales du site, le sitemap, le fichier robots.txt et les URLs à
            soumettre dans Google Search Console.
          </p>
        </div>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-semibold text-amber-100">
            Liens principaux à contrôler
          </h2>

          <div className="mt-5 overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-800 text-neutral-200">
                <tr>
                  <th className="px-4 py-3">Page</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {seoLinks.map((link) => (
                  <tr
                    key={link.url}
                    className="border-t border-neutral-800 text-neutral-300"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {link.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="break-all">{link.url}</span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold text-neutral-950 hover:bg-amber-200"
                      >
                        Ouvrir
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-lg font-semibold text-amber-100">
              Google Search Console
            </h2>

            <p className="mt-3 text-sm text-neutral-300">
              URLs importantes à inspecter manuellement dans Search Console :
            </p>

            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>{SITE_URL}/</li>
              <li>{SITE_URL}/boutique</li>
              <li>{SITE_URL}/boutique/bordeaux</li>
              <li>{SITE_URL}/boutique/bourgogne</li>
              <li>{SITE_URL}/boutique/primeurs-2025</li>
              <li>{SITE_URL}/blog</li>
              <li>{SITE_URL}/sitemap.xml</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <h2 className="text-lg font-semibold text-amber-100">
              Contrôles rapides
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-neutral-300">
              <li>✅ Vérifier que le sitemap s’ouvre sans erreur.</li>
              <li>✅ Vérifier que robots.txt autorise les pages publiques.</li>
              <li>✅ Vérifier que /admin et /api ne sont pas indexables.</li>
              <li>✅ Inspecter les pages principales dans Search Console.</li>
              <li>✅ Demander l’indexation des nouvelles pages importantes.</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-lg font-semibold text-amber-100">
            Rappel important
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-300">
            Cette page admin sert uniquement de tableau de contrôle interne.
            Elle ne modifie pas le sitemap, ne modifie pas les redirections et
            ne déclenche aucune action automatique. Les demandes d’indexation
            doivent être faites directement dans Google Search Console.
          </p>
        </section>
      </div>
    </main>
  );
}
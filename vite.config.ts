import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * SEO output that needs the public site URL: canonical link, absolute
 * og:url / og:image, JSON-LD, robots.txt and sitemap.xml. Set SITE_URL
 * (e.g. https://www.buildroots.in) in the deployment environment. Without
 * it, URL-dependent tags are simply omitted — no domain is guessed.
 */
function seo(siteUrl: string | undefined, phone: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/+$/, '')
  const business = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'BuildRoots Architects',
    description: 'Architecture, interior design and construction practice.',
    email: 'connect@buildroots.in',
    ...(phone ? { telephone: phone } : {}),
    ...(base ? { url: `${base}/`, image: `${base}/og-image.jpg` } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Greater Noida',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
    knowsAbout: ['Architectural design', 'Interior design', 'Construction management', '3D visualisation', 'BOQ and cost planning'],
  }

  return {
    name: 'buildroots-seo',
    transformIndexHtml(html) {
      const tags = [`<script type="application/ld+json">${JSON.stringify(business)}</script>`]
      if (base) {
        tags.unshift(
          `<link rel="canonical" href="${base}/" />`,
          `<meta property="og:url" content="${base}/" />`,
          `<meta property="og:image" content="${base}/og-image.jpg" />`,
          `<meta name="twitter:image" content="${base}/og-image.jpg" />`,
        )
      }
      return html.replace('<!--seo-absolute-->', tags.join('\n    '))
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', ...(base ? [`Sitemap: ${base}/sitemap.xml`] : [])].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })
      if (base) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}/</loc></url>\n</urlset>\n`
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), seo(env.SITE_URL, env.VITE_PUBLIC_PHONE)],
    build: {
      // The 3D chunk (three.js + R3F + post-processing, ~1.1 MB / ~300 kB gzip) is
      // loaded lazily after the page shell, so its size doesn't block first paint.
      // Manual vendor grouping was tried and pulled React into the 3D vendor chunk,
      // which made three.js preload eagerly — the default split keeps it lazy.
      chunkSizeWarningLimit: 1200,
    },
  }
})

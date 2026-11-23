import type { APIRoute } from 'astro';
import business from '../utils/business';

export const GET: APIRoute = () => {
  const siteUrl = business.seo.siteUrl;
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteUrl}/en/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/"/>
    <xhtml:link rel="alternate" hreflang="hi" href="${siteUrl}/hi/"/>
    <xhtml:link rel="alternate" hreflang="mr" href="${siteUrl}/mr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/en/"/>
    <lastmod>2026-11-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/hi/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/"/>
    <xhtml:link rel="alternate" hreflang="hi" href="${siteUrl}/hi/"/>
    <xhtml:link rel="alternate" hreflang="mr" href="${siteUrl}/mr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/en/"/>
    <lastmod>2026-11-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/mr/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/"/>
    <xhtml:link rel="alternate" hreflang="hi" href="${siteUrl}/hi/"/>
    <xhtml:link rel="alternate" hreflang="mr" href="${siteUrl}/mr/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/en/"/>
    <lastmod>2026-11-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  return new Response(content, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};

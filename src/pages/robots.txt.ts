import type { APIRoute } from 'astro';
import business from '../utils/business';

export const GET: APIRoute = () => {
  const siteUrl = business.seo.siteUrl;
  const content = `# Amrapali Makeover — robots.txt
# Configured siteUrl: ${siteUrl} (Pending Owner Domain Purchase & Verification)

User-agent: *
Allow: /
Disallow: /styleguide/

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};

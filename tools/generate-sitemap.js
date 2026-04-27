#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const SITE_URL = process.env.SITE_URL || 'https://poseidondivingcharters.com';

// Public routes (admin and dynamic blog post slugs intentionally excluded)
const ROUTES = [
  { loc: '/',                  changefreq: 'weekly',  priority: '1.0' },
  { loc: '/experiences',       changefreq: 'weekly',  priority: '0.9' },
  { loc: '/pre-designed',      changefreq: 'weekly',  priority: '0.9' },
  { loc: '/tailor-made',       changefreq: 'weekly',  priority: '0.9' },
  { loc: '/exclusive-charter', changefreq: 'weekly',  priority: '0.9' },
  { loc: '/beach-charter',     changefreq: 'weekly',  priority: '0.9' },
  { loc: '/about',             changefreq: 'monthly', priority: '0.7' },
  { loc: '/sustainability',    changefreq: 'monthly', priority: '0.6' },
  { loc: '/contact',           changefreq: 'monthly', priority: '0.7' },
  { loc: '/faq',               changefreq: 'monthly', priority: '0.6' },
  { loc: '/blog',              changefreq: 'weekly',  priority: '0.7' },
  { loc: '/terms',             changefreq: 'yearly',  priority: '0.3' },
  { loc: '/privacy',           changefreq: 'yearly',  priority: '0.3' },
  { loc: '/refund-policy',     changefreq: 'yearly',  priority: '0.3' },
  { loc: '/cookies',           changefreq: 'yearly',  priority: '0.3' },
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const urls = ROUTES.map(({ loc, changefreq, priority }) => {
    const fullUrl = `${SITE_URL}${loc}`;
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function main() {
  const xml = generateSitemap();
  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf8');
  console.log(`✓ sitemap.xml written (${ROUTES.length} URLs)`);
}

import { fileURLToPath } from 'url';
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) main();

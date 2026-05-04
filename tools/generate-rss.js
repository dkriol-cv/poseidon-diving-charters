#!/usr/bin/env node
/**
 * Generate /rss.xml — RSS 2.0 feed of all published blog posts, pulled from
 * Supabase at build time.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pgrest } from './_supabase.js';

const SITE_URL = process.env.SITE_URL || 'https://poseidondivingcharters.com';
const FEED_TITLE = 'Poseidon Diving Charters — Blog';
const FEED_DESCRIPTION =
  'Stories, dive site guides and tips from the team at Poseidon Diving Charters in Lagos, Algarve.';

function xmlEscape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc822(date) {
  if (!date) return new Date().toUTCString();
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

async function main() {
  let posts = [];
  try {
    posts = await pgrest(
      'blog_posts?select=title,slug,excerpt,published_at,updated_at,featured_image_url,category,author' +
        '&status=eq.published&deleted_at=is.null&order=published_at.desc&limit=50'
    );
  } catch (err) {
    console.warn('⚠ blog_posts fetch failed, writing empty feed:', err.message);
  }

  const buildDate = rfc822(new Date());
  const lastPost = posts[0]?.published_at;
  const lastBuildDate = lastPost ? rfc822(lastPost) : buildDate;

  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/blog/${p.slug}`;
      const pub = rfc822(p.published_at);
      const desc = p.excerpt || '';
      const enclosure = p.featured_image_url
        ? `\n      <enclosure url="${xmlEscape(p.featured_image_url)}" type="image/jpeg" />`
        : '';
      const category = p.category ? `\n      <category>${xmlEscape(p.category)}</category>` : '';
      const author = p.author ? `\n      <dc:creator>${xmlEscape(p.author)}</dc:creator>` : '';
      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>${author}${category}
      <description>${xmlEscape(desc)}</description>${enclosure}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
${items}
  </channel>
</rss>
`;

  const outPath = path.join(process.cwd(), 'public', 'rss.xml');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`✓ rss.xml written (${posts.length} items)`);
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) main().catch((e) => { console.error(e); process.exit(1); });

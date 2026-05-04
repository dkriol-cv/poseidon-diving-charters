#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const SITE_URL = process.env.SITE_URL || 'https://poseidondivingcharters.com';

// Explicit map: source file (relative to src/pages) -> public URL
// Mirrors the routes declared in src/App.jsx (admin and dynamic routes excluded)
const PAGE_MAP = [
  { file: 'HomePage.jsx',           url: '/'                  },
  { file: 'ExperiencesPage.jsx',    url: '/experiences'       },
  { file: 'PreDesignedPage.jsx',    url: '/pre-designed'      },
  { file: 'TailorMadePage.jsx',     url: '/tailor-made'       },
  { file: 'ExclusiveCharterPage.jsx', url: '/exclusive-charter' },
  { file: 'BeachCharterPage.jsx',   url: '/beach-charter'     },
  { file: 'AboutPage.jsx',          url: '/about'             },
  { file: 'SustainabilityPage.jsx', url: '/sustainability'    },
  { file: 'ContactPage.jsx',        url: '/contact'           },
  { file: 'FAQ.jsx',                url: '/faq'               },
  { file: 'TermsOfService.jsx',     url: '/terms'             },
  { file: 'PrivacyPolicy.jsx',      url: '/privacy'           },
  { file: 'RefundPolicy.jsx',       url: '/refund-policy'     },
  { file: 'CookiePolicy.jsx',       url: '/cookies'           },
  { file: 'blog/BlogArchivePage.jsx', url: '/blog'            },
];

const TITLE_RE = /<title[^>]*?>\s*([\s\S]*?)\s*<\/title>/i;
const DESC_RE  = /<meta\s+name=["']description["']\s+content=(["'])([\s\S]*?)\1/i;
// Helmet often uses {dynamic || "fallback"} — pull the fallback string from the JSX expression
const DESC_JSX_RE  = /<meta\s+name=["']description["']\s+content=\{[^}]*?["']([^"']{20,})["'][^}]*?\}/i;
const TITLE_JSX_RE = /<title[^>]*>\s*\{[^}]*?["']([^"']{5,})["'][^}]*?\}\s*([^<]*)<\/title>/i;

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .trim();
}

function extractMeta(content) {
  // Prefer the static fallback string in `service?.title || "Pre-Designed..."` patterns
  const titleJsx = content.match(TITLE_JSX_RE);
  let title = titleJsx ? `${titleJsx[1]}${titleJsx[2] || ''}` : null;
  if (!title) {
    const t = content.match(TITLE_RE);
    if (t) title = t[1].replace(/\{[^}]*\}/g, '').replace(/['"]/g, '');
  }

  let description = null;
  const descJsx = content.match(DESC_JSX_RE);
  if (descJsx) description = descJsx[1];
  if (!description) {
    const d = content.match(DESC_RE);
    if (d) description = d[2].replace(/\{[^}]*\}/g, '');
  }

  return { title: cleanText(title), description: cleanText(description) };
}

function generateLlmsTxt(pages) {
  const isExperience = (u) => /^\/(pre-designed|tailor-made|exclusive-charter|beach-charter|experiences)$/.test(u);
  const isLegal      = (u) => /^\/(terms|privacy|refund-policy|cookies)$/.test(u);
  const isBlog       = (u) => /^\/blog/.test(u);

  const main        = pages.filter(p => !isExperience(p.url) && !isLegal(p.url) && !isBlog(p.url) && p.url !== '/');
  const home        = pages.find(p => p.url === '/');
  const experiences = pages.filter(p => isExperience(p.url));
  const blog        = pages.filter(p => isBlog(p.url));
  const legal       = pages.filter(p => isLegal(p.url));

  const fmt = (p) => `- [${p.title}](${SITE_URL}${p.url}): ${p.description}`;

  const out = [];
  out.push('# Poseidon Diving Charters');
  out.push('');
  out.push('> Premium private diving and boat charters operating from Marina de Lagos, Algarve, Portugal. Maximum 4 guests per charter, expert dive guides, premium meals and refreshments included.');
  out.push('');
  out.push('Contact: info@poseidondivingcharters.com · +351 924 955 333 · Marina de Lagos (Gate E–I), Lagos, Portugal');
  out.push('');
  out.push('## Optional');
  out.push(`- [Full content for LLMs](${SITE_URL}/llms-full.txt): long-form pages, services and blog posts`);
  out.push(`- [Services catalog](${SITE_URL}/services.txt): active services with prices`);
  out.push(`- [Blog RSS feed](${SITE_URL}/rss.xml): latest published posts`);
  out.push(`- [Sitemap](${SITE_URL}/sitemap.xml)`);
  out.push('');

  if (home) {
    out.push('## Home');
    out.push(fmt(home));
    out.push('');
  }
  if (experiences.length) {
    out.push('## Experiences');
    out.push(experiences.sort((a, b) => a.url.localeCompare(b.url)).map(fmt).join('\n'));
    out.push('');
  }
  if (main.length) {
    out.push('## Information');
    out.push(main.sort((a, b) => a.url.localeCompare(b.url)).map(fmt).join('\n'));
    out.push('');
  }
  if (blog.length) {
    out.push('## Blog');
    out.push(blog.map(fmt).join('\n'));
    out.push('');
  }
  if (legal.length) {
    out.push('## Legal');
    out.push(legal.sort((a, b) => a.url.localeCompare(b.url)).map(fmt).join('\n'));
    out.push('');
  }

  return out.join('\n');
}

function main() {
  const pagesDir = path.join(process.cwd(), 'src', 'pages');
  if (!fs.existsSync(pagesDir)) {
    console.error('❌ src/pages not found');
    process.exit(1);
  }

  const pages = [];
  for (const { file, url } of PAGE_MAP) {
    const filePath = path.join(pagesDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ skipped (missing): ${file}`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const meta = extractMeta(content);
    pages.push({
      url,
      title: meta.title || `Poseidon Diving Charters`,
      description: meta.description || 'Premium private diving and boat charters in Lagos, Algarve.',
    });
  }

  const outPath = path.join(process.cwd(), 'public', 'llms.txt');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, generateLlmsTxt(pages), 'utf8');
  console.log(`✓ llms.txt written (${pages.length} pages)`);
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) main();

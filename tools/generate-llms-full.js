#!/usr/bin/env node
/**
 * Generate /llms-full.txt — long-form, content-rich version of llms.txt.
 *
 * The short llms.txt is a navigation index. llms-full.txt should give an LLM
 * crawler the *content* it needs to answer questions about the site without
 * having to render React routes. We build it from:
 *   - hand-written rich summaries of each public page
 *   - the live list of active services (Supabase)
 *   - the latest published blog posts (Supabase) — title + excerpt + body
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pgrest } from './_supabase.js';

const SITE_URL = process.env.SITE_URL || 'https://poseidondivingcharters.com';

const PAGE_SUMMARIES = [
  {
    url: '/',
    title: 'Home',
    body: `Poseidon Diving Charters is a premium private diving and boat-charter
operation based at Marina de Lagos (Gate E–I), Algarve, Portugal. We focus on
small-group exclusivity: every charter takes a maximum of 4 guests on a fully
private vessel, with a dedicated captain and expert dive guide. Premium meals
and refreshments are included on every trip. Operating window: first activity
at 09:30, last activity ends at 20:30.`,
  },
  {
    url: '/experiences',
    title: 'Experiences',
    body: `An overview of all the experiences we offer: tailor-made diving
charters, pre-designed diving charters (3/4 day or full day) and exclusive
private boat charters (sunset, morning, afternoon, full day, 3/4 day). All
charters can be booked directly via WhatsApp, phone or email.`,
  },
  {
    url: '/tailor-made',
    title: 'Tailor-made Diving Charter',
    body: `A bespoke diving experience built around your skill level, the marine
life or sites you want to see, the depth profile you prefer and the pace you
enjoy. Includes private consultation before the trip, captain, expert dive
guide, premium gear, and premium meals on board. Suitable for certified divers.`,
  },
  {
    url: '/pre-designed',
    title: 'Pre-designed Diving Charter',
    body: `Curated, all-inclusive diving itineraries that combine the best local
dive sites of the Algarve coast with effortless booking. Available as a 3/4 day
(approx. 5.5 hours) or full day (approx. 7.5 hours). Two dives per trip, expert
guidance, premium meals and refreshments included. Maximum 4 guests.`,
  },
  {
    url: '/exclusive-charter',
    title: 'Exclusive Private Boat Charter',
    body: `Private exclusivity on the water — boat, crew and adventure are
entirely yours. Options include sunset charter, morning charter, afternoon
charter, full day and 3/4 day boat charters. Activities can include
paddleboarding, swimming, snorkelling and dolphin watching depending on
conditions. Max 4 guests.`,
  },
  {
    url: '/about',
    title: 'About',
    body: `Poseidon Diving Charters is a small, owner-operated company in Lagos
focused on personalised service for selective travellers and divers. We run a
single dedicated vessel so we can guarantee privacy on every trip and protect
the marine environment we work in.`,
  },
  {
    url: '/sustainability',
    title: 'Sustainability',
    body: `We operate with strict respect for the Algarve marine environment:
fixed mooring buoys instead of anchoring on reefs, briefings on no-touch diving,
reusable on-board service and active reporting of marine debris. Group size is
capped at 4 partly to keep underwater impact minimal.`,
  },
  {
    url: '/contact',
    title: 'Contact',
    body: `Email: info@poseidondivingcharters.com. Phone / WhatsApp:
+351 924 955 333. Address: Marina de Lagos, Gate E–I, Lagos, Algarve, Portugal.
Bookings are confirmed by WhatsApp, email or phone — typically replied within
24 hours.`,
  },
  {
    url: '/faq',
    title: 'FAQ',
    body: `Common questions about certification requirements, gear rental,
weather cancellations, group size, what to bring, accessibility, payment and
refund policy.`,
  },
  {
    url: '/blog',
    title: 'Blog',
    body: `Articles about dive sites in Lagos, marine life, equipment tips and
local guides. Latest posts are listed below.`,
  },
];

function clean(text) {
  if (!text) return '';
  // Strip HTML tags from blog body, collapse whitespace, decode common entities
  return String(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text, max = 1500) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

async function main() {
  let services = [];
  let posts = [];
  try {
    services = await pgrest(
      'services?select=slug,name,title,description,base_price,promo_price&is_active=eq.true&order=display_order.asc'
    );
  } catch (err) {
    console.warn('⚠ services fetch failed:', err.message);
  }
  try {
    posts = await pgrest(
      'blog_posts?select=title,slug,excerpt,content,published_at,category,author' +
        '&status=eq.published&deleted_at=is.null&order=published_at.desc&limit=50'
    );
  } catch (err) {
    console.warn('⚠ blog_posts fetch failed:', err.message);
  }

  const out = [];
  out.push('# Poseidon Diving Charters — Full Content');
  out.push('');
  out.push(
    '> Long-form llms.txt for AI assistants. Contains rich summaries of every'
  );
  out.push(
    '> public page plus the full list of active services and the latest blog posts.'
  );
  out.push('');
  out.push(`Site: ${SITE_URL}`);
  out.push('Location: Marina de Lagos (Gate E–I), Lagos, Algarve, Portugal');
  out.push('Contact: info@poseidondivingcharters.com · +351 924 955 333');
  out.push(`Last updated: ${new Date().toISOString().split('T')[0]}`);
  out.push('');

  // Pages
  out.push('## Pages');
  out.push('');
  for (const p of PAGE_SUMMARIES) {
    out.push(`### ${p.title}`);
    out.push(`URL: ${SITE_URL}${p.url}`);
    out.push('');
    out.push(p.body.replace(/\s+/g, ' ').trim());
    out.push('');
  }

  // Services
  out.push('## Active services');
  out.push('');
  if (services.length === 0) {
    out.push('_(no active services available at build time)_');
    out.push('');
  } else {
    for (const s of services) {
      out.push(`### ${clean(s.title || s.name || s.slug)}`);
      const parts = [];
      if (s.base_price) {
        let price = `€${Number(s.base_price).toFixed(2)}`;
        if (s.promo_price && Number(s.promo_price) > 0 && Number(s.promo_price) < Number(s.base_price)) {
          price += ` (promo €${Number(s.promo_price).toFixed(2)})`;
        }
        parts.push(`Price: ${price}`);
      }
      parts.push(`Slug: ${s.slug}`);
      out.push(parts.join(' · '));
      if (s.description) {
        out.push('');
        out.push(clean(s.description));
      }
      out.push('');
    }
  }

  // Blog posts
  out.push('## Blog posts');
  out.push('');
  if (posts.length === 0) {
    out.push('_(no published posts at build time)_');
  } else {
    for (const p of posts) {
      const date = p.published_at ? p.published_at.slice(0, 10) : '';
      out.push(`### ${clean(p.title)}`);
      out.push(`URL: ${SITE_URL}/blog/${p.slug}`);
      const meta = [];
      if (date) meta.push(`Published: ${date}`);
      if (p.category) meta.push(`Category: ${p.category}`);
      if (p.author) meta.push(`Author: ${p.author}`);
      if (meta.length) out.push(meta.join(' · '));
      out.push('');
      const body = truncate(clean(p.content || p.excerpt || ''), 1800);
      if (body) out.push(body);
      out.push('');
    }
  }

  const outPath = path.join(process.cwd(), 'public', 'llms-full.txt');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out.join('\n'), 'utf8');
  console.log(`✓ llms-full.txt written (${PAGE_SUMMARIES.length} pages, ${services.length} services, ${posts.length} posts)`);
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) main().catch((e) => { console.error(e); process.exit(1); });

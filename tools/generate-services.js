#!/usr/bin/env node
/**
 * Generate /services.txt — a plain-text catalog of active services pulled
 * from Supabase. Useful for LLM crawlers and as a standalone manifest of
 * what the business offers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pgrest } from './_supabase.js';

const SITE_URL = process.env.SITE_URL || 'https://poseidondivingcharters.com';

const SERVICE_LINKS = {
  'tailor-made': '/tailor-made',
  'pre-designed': '/pre-designed',
  'diving-3-4-day': '/pre-designed',
  'diving-full-day': '/pre-designed',
  'exclusive-charter': '/exclusive-charter',
  'sunset-charter': '/exclusive-charter',
  'morning-charter': '/exclusive-charter',
  'afternoon-charter': '/exclusive-charter',
  'boat-3-4-day-charter': '/exclusive-charter',
};

function fmtPrice(p, promo) {
  if (!p && !promo) return '';
  const base = p ? `€${Number(p).toFixed(2)}` : '';
  if (promo && Number(promo) > 0 && Number(promo) < Number(p)) {
    return `${base} (promo €${Number(promo).toFixed(2)})`;
  }
  return base;
}

function clean(text) {
  if (!text) return '';
  return String(text).replace(/\s+/g, ' ').trim();
}

async function main() {
  let services = [];
  try {
    services = await pgrest(
      'services?select=slug,name,title,description,base_price,promo_price&is_active=eq.true&order=display_order.asc'
    );
  } catch (err) {
    console.warn('⚠ services fetch failed, writing empty file:', err.message);
  }

  const lines = [];
  lines.push('# Poseidon Diving Charters — Services');
  lines.push('');
  lines.push(`Site: ${SITE_URL}`);
  lines.push('Location: Marina de Lagos (Gate E–I), Lagos, Algarve, Portugal');
  lines.push('Contact: info@poseidondivingcharters.com · +351 924 955 333 · WhatsApp +351 924 955 333');
  lines.push(`Generated: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');
  lines.push('All charters are fully private with a maximum of 4 guests, premium meals and');
  lines.push('refreshments included, dedicated captain and expert dive guide. Operating window:');
  lines.push('first activity 09:30, last activity ends 20:30.');
  lines.push('');
  lines.push('---');
  lines.push('');

  if (services.length === 0) {
    lines.push('(No active services available at build time.)');
  } else {
    for (const s of services) {
      const link = SERVICE_LINKS[s.slug] || '/experiences';
      lines.push(`## ${clean(s.title || s.name || s.slug)}`);
      lines.push(`- Slug: ${s.slug}`);
      const price = fmtPrice(s.base_price, s.promo_price);
      if (price) lines.push(`- Price: ${price}`);
      lines.push(`- URL: ${SITE_URL}${link}`);
      if (s.description) {
        lines.push('');
        lines.push(clean(s.description));
      }
      lines.push('');
    }
  }

  const outPath = path.join(process.cwd(), 'public', 'services.txt');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`✓ services.txt written (${services.length} services)`);
}

const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) main().catch((e) => { console.error(e); process.exit(1); });

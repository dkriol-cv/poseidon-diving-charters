// SEO + Schema.org helpers.
// All functions return plain objects; the caller stringifies and embeds inside
// <script type="application/ld+json"> in <Helmet>.

export const SITE_URL = 'https://poseidondivingcharters.com';
export const SITE_NAME = 'Poseidon Diving Charters';
export const SITE_LOGO =
  'https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Poseidon%20Diving%20Charters%20-%20Logo%20Blue/poseidon_diving_charters_black_favicon-01.png';

const PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  logo: {
    '@type': 'ImageObject',
    url: SITE_LOGO,
  },
};

// ---------- Helmet meta tags for blog posts (existing helper kept) ----------
export const generateMetaTags = (post) => {
  if (!post) return {};

  const title = post.seo_title || post.title || 'Blog | Poseidon Diving Charters';
  const description =
    post.seo_description || post.excerpt || 'Read our latest diving articles and news.';
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE_URL;
  const url = `${origin}/blog/${post.slug || ''}`;
  const image = post.featured_image_url || `${origin}/default-og-image.jpg`;

  return {
    title,
    description,
    keywords: post.seo_keywords || (post.tags ? post.tags.join(', ') : ''),
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    canonical: url,
  };
};

// ---------- Article (blog post) ----------
export const articleSchema = (post) => {
  if (!post) return null;
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.featured_image_url ? [post.featured_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: [{ '@type': 'Person', name: post.author || 'Poseidon Diving Team' }],
    publisher: PUBLISHER,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category || undefined,
    keywords: post.seo_keywords || (Array.isArray(post.tags) ? post.tags.join(', ') : undefined),
    inLanguage: 'en',
  };
};

// Backwards-compat with the old name used elsewhere (returns JSON string)
export const generateJsonLd = (post) => {
  const s = articleSchema(post);
  return s ? JSON.stringify(s) : '';
};

// ---------- FAQPage ----------
// faqs: [{ question, answer }, ...] — already flat, ignoring categories
export const faqPageSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        // Schema.org accepts plain text or HTML; we pass plain text.
        text: f.answer,
      },
    })),
  };
};

// ---------- Service (each charter type) ----------
// service: { title, name, slug, description, base_price, promo_price, options? }
// extras:  { url, image, areaServed, hoursAvailable, serviceType }
export const serviceSchema = (service, extras = {}) => {
  if (!service) return null;

  const url = extras.url || `${SITE_URL}/`;
  const offers = [];

  if (service.base_price) {
    offers.push({
      '@type': 'Offer',
      price: String(service.base_price),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url,
    });
  }
  if (Array.isArray(service.options)) {
    for (const opt of service.options) {
      if (!opt || (!opt.price && !opt.base_price)) continue;
      offers.push({
        '@type': 'Offer',
        name: opt.name || opt.title,
        price: String(opt.price || opt.base_price),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url,
      });
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title || service.name,
    description: service.description,
    serviceType: extras.serviceType || 'Private diving and boat charter',
    provider: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Marina de Lagos, Gate E - F - G - H - I',
        addressLocality: 'Lagos',
        addressRegion: 'Algarve',
        postalCode: '8600',
        addressCountry: 'PT',
      },
      telephone: '+351924955333',
      email: 'info@poseidondivingcharters.com',
    },
    areaServed: extras.areaServed || { '@type': 'Place', name: 'Algarve, Portugal' },
    hoursAvailable: extras.hoursAvailable || {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:30',
      closes: '20:30',
    },
    image: extras.image || undefined,
    url,
    offers: offers.length ? offers : undefined,
  };
};

// ---------- BreadcrumbList ----------
// items: [{ name, url }] — url can be relative or absolute
export const breadcrumbSchema = (items) => {
  if (!items || !items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
};

// Backwards-compat
export const generateBreadcrumbJsonLd = (items) => {
  const s = breadcrumbSchema(items);
  return s ? JSON.stringify(s) : '';
};

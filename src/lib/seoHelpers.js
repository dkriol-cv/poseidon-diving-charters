export const generateMetaTags = (post) => {
  if (!post) return {};
  
  const title = post.seo_title || post.title || 'Blog | Poseidon Diving Charters';
  const description = post.seo_description || post.excerpt || 'Read our latest diving articles and news.';
  const url = `${window.location.origin}/blog/${post.slug || ''}`;
  const image = post.featured_image_url || `${window.location.origin}/default-og-image.jpg`;

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

export const generateJsonLd = (post, type = 'Article') => {
  if (!post) return '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    headline: post.title,
    image: post.featured_image_url ? [post.featured_image_url] : [],
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: [{
      '@type': 'Person',
      name: post.author || 'Poseidon Team',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Poseidon Diving Charters',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png` // Replace with actual logo URL if available
      }
    },
    description: post.excerpt,
  };

  return JSON.stringify(schema);
};

export const generateBreadcrumbJsonLd = (items) => {
  if (!items || !items.length) return '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return JSON.stringify(schema);
};
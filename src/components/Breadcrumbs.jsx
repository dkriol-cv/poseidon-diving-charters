import React from 'react';
import { Helmet } from 'react-helmet';
import { breadcrumbSchema } from '@/lib/seoHelpers';

/**
 * Invisible BreadcrumbList JSON-LD emitter.
 *
 * Renders nothing visible — just injects the schema into <head> via Helmet so
 * search engines and AI crawlers can build rich-result breadcrumbs for the
 * page. Use on every page except the home.
 *
 * Usage:
 *   <Breadcrumbs items={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Experiences', url: '/experiences' },
 *   ]} />
 */
const Breadcrumbs = ({ items }) => {
  const schema = breadcrumbSchema(items);
  if (!schema) return null;
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export default Breadcrumbs;

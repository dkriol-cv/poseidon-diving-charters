import { BLOG_CATEGORIES } from './blogConstants';

export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateExcerpt = (content, length = 160) => {
  if (!content) return '';
  const plainText = content.replace(/<[^>]+>/g, '');
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length).trim() + '...';
};

export const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const textLength = content.replace(/<[^>]+>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(textLength / wordsPerMinute);
  return readingTime > 0 ? readingTime : 1;
};

export const formatBlogDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

export const truncateText = (text, length) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

export const getReadableCategory = (categoryName) => {
  if (!categoryName) return { name: 'General', color: 'bg-gray-100 text-gray-800' };
  
  // Try finding by name or slug
  const category = BLOG_CATEGORIES?.find(c => 
    c.name.toLowerCase() === categoryName.toLowerCase() || 
    c.slug === categoryName.toLowerCase()
  );
  
  // Fallback defaults for specific requested categories if not in constants
  if (!category) {
    if (categoryName.toLowerCase() === 'sustainability' || categoryName.toLowerCase() === 'sustentabilidade') return { name: 'Sustainability', color: 'bg-emerald-100 text-emerald-800' };
    if (categoryName.toLowerCase() === 'diving' || categoryName.toLowerCase() === 'mergulho') return { name: 'Diving', color: 'bg-blue-100 text-blue-800' };
    if (categoryName.toLowerCase() === 'expeditions' || categoryName.toLowerCase() === 'expedições') return { name: 'Expeditions', color: 'bg-indigo-100 text-indigo-800' };
    if (categoryName.toLowerCase() === 'tips' || categoryName.toLowerCase() === 'dicas') return { name: 'Tips', color: 'bg-amber-100 text-amber-800' };
    if (categoryName.toLowerCase() === 'equipment' || categoryName.toLowerCase() === 'equipamento') return { name: 'Equipment', color: 'bg-slate-100 text-slate-800' };
    
    return { name: categoryName, color: 'bg-gray-100 text-gray-800' };
  }
  
  return category;
};
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

export default function TagCloud({ currentTag, onTagClick }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('tags')
          .eq('status', 'published')
          .is('deleted_at', null)
          .not('tags', 'is', null);

        if (error) throw error;

        const tagCounts = {};
        data.forEach(post => {
          if (Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
              if (tag) tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        const tagArray = Object.entries(tagCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setTags(tagArray);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Failed to load tags.');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const getFontSize = (count, minCount, maxCount) => {
    const minSize = 0.75; // rem
    const maxSize = 1.25; // rem
    if (maxCount === minCount) return `${minSize}rem`;
    const size = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    return `${size}rem`;
  };

  if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#03c4c9] w-6 h-6" /></div>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (tags.length === 0) return <p className="text-sm text-gray-500">No tags found.</p>;

  const counts = tags.map(t => t.count);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map(tag => {
        const isActive = currentTag === tag.name;
        return (
          <button
            key={tag.name}
            onClick={() => onTagClick && onTagClick(tag.name)}
            style={{ fontSize: getFontSize(tag.count, minCount, maxCount) }}
            className={`px-2 py-1 rounded-md transition-colors duration-200 border ${
              isActive 
                ? 'bg-[#2d353b] border-[#2d353b] text-white' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-[#03c4c9] hover:text-[#03c4c9]'
            }`}
          >
            #{tag.name}
          </button>
        );
      })}
    </div>
  );
}
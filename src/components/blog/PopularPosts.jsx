import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { formatBlogDate } from '@/lib/blogHelpers';
import { Loader2, Eye } from 'lucide-react';

export default function PopularPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, featured_image_url, published_at, views_count')
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('views_count', { ascending: false, nullsFirst: false })
          .limit(5);

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching popular posts:', err);
        setError('Failed to load popular posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#03c4c9] w-6 h-6" /></div>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (posts.length === 0) return <p className="text-sm text-gray-500">No popular posts yet.</p>;

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
            {post.featured_image_url ? (
              <img 
                src={post.featured_image_url} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2d353b] group-hover:text-[#03c4c9] line-clamp-2 leading-tight transition-colors">
              {post.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">{formatBlogDate(post.published_at)}</p>
              <span className="text-[10px] bg-gray-50 flex items-center text-gray-500 px-1.5 py-0.5 rounded-full">
                <Eye className="w-3 h-3 mr-1" /> {post.views_count || 0}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
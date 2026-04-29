import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CalendarDays, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { formatBlogDate, getReadableCategory } from '@/lib/blogHelpers';
import { Button } from '@/components/ui/button';
import { optimizeImage, srcSet } from '@/lib/imageHelpers';

const BlogPreview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      console.log('[BlogPreview] Fetching latest posts...');
      setLoading(true);
      setError(null);
      
      try {
        console.log('[BlogPreview] Attempting full query...');
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, featured_image_url, featured_image_alt, category, published_at, reading_time')
          .eq('status', 'published')
          .is('deleted_at', null)
          .order('published_at', { ascending: false })
          .limit(3);

        if (fetchError) throw fetchError;
        
        console.log(`[BlogPreview] Successfully fetched ${data?.length || 0} posts.`);
        setPosts(data || []);
        
      } catch (err) {
        console.error('[BlogPreview] Full query failed:', err);
        
        try {
          console.log('[BlogPreview] Attempting fallback query...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('blog_posts')
            .select('id, title, slug, excerpt, featured_image_url, featured_image_alt, category, published_at, reading_time')
            .eq('status', 'published')
            .order('id', { ascending: false })
            .limit(3);

          if (fallbackError) throw fallbackError;
          
          console.log(`[BlogPreview] Fallback query successful. Fetched ${fallbackData?.length || 0} posts.`);
          setPosts(fallbackData || []);
          
        } catch (fallbackErr) {
          console.error('[BlogPreview] Fallback query failed:', fallbackErr);
          setError('Failed to load featured posts.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  if (loading) return null;
  if (error || posts.length === 0) return null;

  return (
    <section className="py-24 px-4 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          {...fadeInUp}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h2 className="text-sm font-bold text-[#03c4c9] uppercase tracking-widest mb-2">Underwater Inspiration</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-[#2d353b] tracking-tight">
              Latest Blog Articles
            </h3>
          </div>
          <Button asChild variant="outline" className="border-[#03c4c9] text-[#03c4c9] hover:bg-[#03c4c9] hover:text-white rounded-xl font-bold h-12 px-6">
            <Link to="/blog">View All Articles</Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const categoryObj = getReadableCategory(post.category);
            
            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                <div className="relative aspect-video overflow-hidden">
                  {(() => {
                    const raw = post.featured_image_url || 'https://images.unsplash.com/photo-1695173583133-c19731e2df44';
                    return (
                      <img
                        src={optimizeImage(raw, { width: 600, quality: 70 })}
                        srcSet={srcSet(raw, [400, 600, 900], { quality: 70 })}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        width="600"
                        height="338"
                        alt={post.featured_image_alt || post.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    );
                  })()}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryObj.color} shadow-sm`}>
                      {categoryObj.name}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatBlogDate(post.published_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.reading_time || 5} min read
                    </div>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="block group-hover:text-[#03c4c9] transition-colors">
                    <h4 className="text-xl font-bold text-[#2d353b] mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                  </Link>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-[#03c4c9] font-bold text-sm group-hover:text-[#02a8ad] transition-colors mt-auto"
                  >
                    Read Article <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
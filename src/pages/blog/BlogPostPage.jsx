import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { formatBlogDate, getReadableCategory } from '@/lib/blogHelpers';
import { Loader2, ArrowLeft, Clock, CalendarDays, User, Share2, Facebook, Twitter, Linkedin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { incrementViewCount } from '@/hooks/useBlog';
import Breadcrumbs from '@/components/Breadcrumbs';
import { articleSchema } from '@/lib/seoHelpers';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPostData();
  }, [slug]);

  useEffect(() => {
    if (post && post.id) {
      incrementViewCount(post.id);
    }
  }, [post?.id]);

  const fetchPostData = async () => {
    console.log(`[BlogPostPage] Fetching post with slug: ${slug}`);
    setLoading(true);
    setErrorMsg(null);
    
    try {
      console.log('[BlogPostPage] Attempting full post query...');
      let currentPost = null;
      
      try {
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .is('deleted_at', null)
          .maybeSingle();
          
        if (fetchError) throw fetchError;
        currentPost = data;
      } catch (err) {
        console.warn('[BlogPostPage] Full query failed, trying fallback...', err);
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
          
        if (fallbackError) throw fallbackError;
        currentPost = fallbackData;
      }

      if (!currentPost) {
        console.warn('[BlogPostPage] Post not found for slug:', slug);
        setErrorMsg('Post not found');
        setLoading(false);
        return;
      }

      console.log('[BlogPostPage] Successfully fetched main post:', currentPost.title);
      setPost(currentPost);

      // Fetch related posts
      if (currentPost.category) {
        console.log(`[BlogPostPage] Fetching related posts for category: ${currentPost.category}`);
        try {
          const { data: related } = await supabase
            .from('blog_posts')
            .select('id, title, slug, featured_image_url, published_at, reading_time')
            .eq('category', currentPost.category)
            .eq('status', 'published')
            .is('deleted_at', null)
            .neq('id', currentPost.id)
            .order('published_at', { ascending: false })
            .limit(3);
          setRelatedPosts(related || []);
        } catch (relatedErr) {
          console.warn('[BlogPostPage] Related posts full query failed, trying fallback...', relatedErr);
          const { data: fallbackRelated } = await supabase
            .from('blog_posts')
            .select('id, title, slug, featured_image_url')
            .eq('category', currentPost.category)
            .eq('status', 'published')
            .neq('id', currentPost.id)
            .limit(3);
          setRelatedPosts(fallbackRelated || []);
        }
      }

    } catch (error) {
      console.error('[BlogPostPage] Error fetching blog post:', error);
      setErrorMsg('Failed to load post');
      toast({
        title: "Error Loading Post",
        description: "Could not load the article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post?.title || '');
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp': shareUrl = `https://wa.me/?text=${text}%20${url}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`; break;
      default: return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#03c4c9] animate-spin mb-4" />
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  if (errorMsg || !post) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h2 className="text-3xl font-bold text-[#2d353b] mb-4">{errorMsg || 'Post not found'}</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The article you are looking for does not exist or has been removed.
        </p>
        <Button asChild className="bg-[#03c4c9] hover:bg-[#02a8ad] text-white">
          <Link to="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
        </Button>
      </div>
    );
  }

  const categoryObj = getReadableCategory(post.category);

  // Schema.org JSON-LD (full Article with publisher, mainEntityOfPage, etc.)
  const jsonLd = articleSchema(post);

  return (
    <article className="min-h-screen bg-gray-50">
      <Breadcrumbs items={[
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: post.title, url: `/blog/${post.slug}` },
      ]} />
      <Helmet>
        <title>{post.seo_title || `${post.title} | Poseidon Diving Blog`}</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        <meta name="keywords" content={post.seo_keywords} />
        <meta property="og:title" content={post.seo_title || post.title} />
        <meta property="og:description" content={post.seo_description || post.excerpt} />
        <meta property="og:image" content={post.featured_image_url} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] w-full mt-16 md:mt-20">
        <img 
          src={post.featured_image_url || 'https://images.unsplash.com/photo-1695173583133-c19731e2df44'} 
          alt={post.featured_image_alt || post.title}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
          <div className="container mx-auto max-w-5xl">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm transition-colors font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
            
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-[#03c4c9] text-white`}>
                {categoryObj.name}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-200 font-medium">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white" />
                {post.author || 'Poseidon Diving Team'}
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-white" />
                {formatBlogDate(post.published_at)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white" />
                {post.reading_time || 5} min read
              </div>
              {post.views_count !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-white" />
                  {post.views_count} views
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12 lg:py-16 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Main Content Column (70%) */}
          <div className="lg:w-[70%]">
            
            {/* Social Share (Desktop left float, Mobile top horizontal) */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center mr-2">
                <Share2 className="w-4 h-4 mr-2" /> Share:
              </span>
              <button onClick={() => shareOnSocial('whatsapp')} className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.656-1.48-1.465-1.653-1.762-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </button>
              <button onClick={() => shareOnSocial('facebook')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#0c5ebd] transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button onClick={() => shareOnSocial('twitter')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button onClick={() => shareOnSocial('linkedin')} className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:bg-[#074c93] transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div 
              className="prose prose-lg max-w-none text-[#2d353b] prose-headings:text-[#2d353b] prose-a:text-[#03c4c9] hover:prose-a:text-[#02a8ad] prose-img:rounded-xl prose-img:shadow-md mb-16"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 py-6 border-t border-b border-gray-200 mb-12">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center mr-2">
                  Tags:
                </span>
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Column (30%) */}
          <div className="lg:w-[30%]">
            <div className="sticky top-28 space-y-8">
              
              {/* 1. Primary CTA Card */}
              <div className="bg-gradient-to-r from-[#03c4c9] to-[#0a9fa5] rounded-xl p-8 text-white text-center shadow-lg relative overflow-hidden">
                <h3 className="text-2xl font-bold mb-4">Ready for Your Adventure?</h3>
                <p className="text-white/90 text-sm mb-6">
                  Turn inspiration into reality. Book your next diving or boat tour experience today.
                </p>
                <Button asChild className="w-full bg-[#f5c842] text-[#2d353b] font-bold hover:bg-yellow-400 hover:text-[#2d353b] transition-colors py-6 text-lg">
                  <Link to="/booking">Book Now</Link>
                </Button>
              </div>

              {/* 2. Secondary CTA Card */}
              <div className="border-2 border-[#03c4c9] rounded-xl p-8 text-center bg-white shadow-sm">
                <h3 className="text-xl font-bold mb-3 text-[#2d353b]">Custom Experiences</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Looking for something unique? Let us create a tailor-made ocean adventure just for you.
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-[#03c4c9] text-[#03c4c9] hover:bg-[#03c4c9] hover:text-white font-bold transition-colors">
                  <Link to="/tailor-made">Plan Your Trip</Link>
                </Button>
              </div>

              {/* 3. Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#2d353b] mb-4 border-b border-gray-100 pb-3">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link key={related.id} to={`/blog/${related.slug}`} className="group flex flex-col gap-2">
                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                          <img 
                            src={related.featured_image_url || 'https://images.unsplash.com/photo-1695173583133-c19731e2df44'} 
                            alt={related.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <h4 className="text-sm font-bold text-[#2d353b] group-hover:text-[#03c4c9] line-clamp-2 transition-colors">
                          {related.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" /> {related.reading_time || 5} min read
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Newsletter */}
              <div className="bg-[#0b1216] rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-2">Newsletter</h3>
                <p className="text-sm text-gray-400 mb-6">Join our community and receive the latest news and exclusive tips for your ocean adventures.</p>
                <form onSubmit={(e) => { e.preventDefault(); toast({title: "Subscribed successfully!", description: "Thank you for joining our newsletter."})}}>
                  <input type="email" placeholder="Enter your email address" required className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white mb-4 text-sm focus:outline-none focus:border-[#03c4c9]" />
                  <Button type="submit" className="w-full bg-[#f5c842] text-[#2d353b] font-bold hover:bg-yellow-400 hover:text-[#2d353b] transition-colors">Subscribe</Button>
                </form>
              </div>

            </div>
          </div>

        </div>
      </section>
    </article>
  );
};

export default BlogPostPage;
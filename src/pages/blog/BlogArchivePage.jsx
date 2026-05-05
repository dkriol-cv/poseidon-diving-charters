import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '@/components/Breadcrumbs';
import { motion } from 'framer-motion';
import { Loader2, SearchX } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { POSTS_PER_PAGE } from '@/lib/blogConstants';
import BlogCard from '@/components/blog/BlogCard';
import FeaturedPostCard from '@/components/blog/FeaturedPostCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import { Button } from '@/components/ui/button';

const BlogArchivePage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    category: null,
    tag: null,
    search: ''
  });
  const [posts, setPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const {
    fetchAllPosts,
    loading,
    error
  } = useBlog();

  useEffect(() => {
    const loadPosts = async () => {
      const isCleanState = filters.page === 1 && !filters.category && !filters.tag && !filters.search;
      const {
        posts: fetchedPosts,
        total
      } = await fetchAllPosts(filters, filters.page, POSTS_PER_PAGE);
      if (isCleanState && fetchedPosts.length > 0) {
        setFeaturedPost(fetchedPosts[0]);
        setPosts(fetchedPosts.slice(1));
        setTotalPosts(total - 1);
      } else {
        setFeaturedPost(null);
        setPosts(fetchedPosts);
        setTotalPosts(total);
      }
    };
    loadPosts();
  }, [filters, fetchAllPosts]);

  const handleFilterChange = newFilters => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      page: prev.page + 1
    }));
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePrevPage = () => {
    if (filters.page > 1) {
      setFilters(prev => ({
        ...prev,
        page: prev.page - 1
      }));
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const hasActiveFilters = filters.category || filters.tag || filters.search;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 xl:pt-24 pb-20">
      <Helmet>
        <title>Blog | Poseidon Diving Charters</title>
        <meta name="description" content="Discover diving tips, marine life insights, and news from Poseidon Diving Charters in Cape Verde." />
      </Helmet>
      <Breadcrumbs items={[{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }]} />

      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-[#0b1216]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566988148642-343730e135bf?q=80&w=1740&auto=format&fit=crop" alt="Diver exploring reef" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1216] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-futura">
            Dive Into Our Blog
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl text-gray-200">
            Stories, tips, and insights from the depths of Lagos and the stunning Algarve coastline.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-8">
          <span className="hover:text-[#03c4c9] cursor-pointer" onClick={() => handleFilterChange({
            category: null, tag: null, search: '', page: 1
          })}>Home</span> / <span className="text-gray-800 font-medium">Blog</span>
          {filters.category && <span> / Category: {filters.category}</span>}
          {filters.tag && <span> / Tag: {filters.tag}</span>}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Column */}
          <div className="lg:w-2/3 xl:w-3/4">
            
            {loading && posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-[#03c4c9] animate-spin mb-4" />
                <p className="text-gray-500">Loading articles...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
                <p className="font-bold mb-2">Failed to load articles</p>
                <p className="text-sm">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-red-200 text-red-600 hover:bg-red-100">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* Featured Post */}
                {featuredPost && <FeaturedPostCard post={featuredPost} />}

                {/* Filter notification */}
                {hasActiveFilters && (
                  <div className="mb-6 flex items-center justify-between bg-blue-50 text-blue-800 px-4 py-3 rounded-lg">
                    <span className="text-sm">
                      Showing results for 
                      {filters.category && <strong className="ml-1">Category: {filters.category}</strong>}
                      {filters.tag && <strong className="ml-1">Tag: {filters.tag}</strong>}
                      {filters.search && <strong className="ml-1">Search: "{filters.search}"</strong>}
                    </span>
                    <button onClick={() => handleFilterChange({
                      category: null, tag: null, search: '', page: 1
                    })} className="text-xs font-bold underline hover:text-blue-600">
                      Clear All
                    </button>
                  </div>
                )}

                {/* Grid of Posts */}
                {posts.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {posts.map(post => <BlogCard key={post.id} post={post} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                      <SearchX className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#2d353b] mb-2">No articles found</h3>
                    <p className="text-gray-500 max-w-md">
                      We couldn't find any articles matching your current filters. Try adjusting your search or clearing filters.
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={() => handleFilterChange({
                        category: null, tag: null, search: '', page: 1
                      })} className="mt-6">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {totalPosts > 0 && totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
                    <Button variant="outline" onClick={handlePrevPage} disabled={filters.page === 1 || loading}>
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500 font-medium">
                      Page {filters.page} of {totalPages}
                    </span>
                    <Button variant="outline" onClick={handleNextPage} disabled={filters.page >= totalPages || loading}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-28">
              <BlogSidebar onFilterChange={handleFilterChange} currentFilters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArchivePage;
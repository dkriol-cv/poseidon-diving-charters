import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const incrementViewCount = async (id) => {
  try {
    await supabase.rpc('increment_view_count', { row_id: id });
  } catch (err) {
    console.error('[useBlog] Error incrementing view count:', err);
  }
};

export const useBlog = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPosts = useCallback(async (filters = {}, page = 1, limit = 10) => {
    console.log('[useBlog] fetchAllPosts called with filters:', filters);
    setLoading(true);
    setError(null);
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // Primary query attempt
      console.log('[useBlog] Attempting full query with optional columns...');
      let query = supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, featured_image_url, featured_image_alt, category, published_at, reading_time', { count: 'exact' })
        .eq('status', 'published')
        .is('deleted_at', null);

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.tag) query = query.contains('tags', [filters.tag]);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const { data, count, error: fetchError } = await query
        .order('published_at', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;
      
      console.log(`[useBlog] Successfully fetched ${data?.length || 0} posts.`);
      return { posts: data || [], total: count || 0, error: null };

    } catch (err) {
      console.error('[useBlog] Full query failed:', err);
      
      try {
        console.log('[useBlog] Attempting fallback query without deleted_at filter...');
        let fallbackQuery = supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, featured_image_url, category, published_at, reading_time', { count: 'exact' })
          .eq('status', 'published');

        if (filters.category) fallbackQuery = fallbackQuery.eq('category', filters.category);
        if (filters.search) fallbackQuery = fallbackQuery.ilike('title', `%${filters.search}%`);

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: fallbackData, count: fallbackCount, error: fallbackError } = await fallbackQuery
          .order('id', { ascending: false }) // use id as safe fallback order
          .range(from, to);

        if (fallbackError) throw fallbackError;

        console.log(`[useBlog] Fallback query successful. Fetched ${fallbackData?.length || 0} posts.`);
        return { posts: fallbackData || [], total: fallbackCount || 0, error: null };

      } catch (fallbackErr) {
        console.error('[useBlog] Fallback query also failed:', fallbackErr);
        setError(fallbackErr.message || 'Failed to load posts');
        return { posts: [], total: 0, error: fallbackErr.message };
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (id) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('[useBlog] Error deleting post:', err);
      throw err;
    }
  }, []);

  return { fetchAllPosts, deletePost, loading, error };
};
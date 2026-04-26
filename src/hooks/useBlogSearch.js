import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useBlogSearch = (searchQuery) => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        return;
      }
      console.log(`[useBlogSearch] Searching for: "${debouncedSearchQuery}"`);
      setIsSearching(true);
      setError(null);
      
      try {
        console.log('[useBlogSearch] Attempting full search query...');
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, published_at')
          .eq('status', 'published')
          .is('deleted_at', null)
          .ilike('title', `%${debouncedSearchQuery}%`)
          .order('published_at', { ascending: false })
          .limit(5);

        if (fetchError) throw fetchError;
        
        console.log(`[useBlogSearch] Found ${data?.length || 0} results.`);
        setSearchResults(data || []);
        
      } catch (err) {
        console.error('[useBlogSearch] Full search query failed:', err);
        
        try {
          console.log('[useBlogSearch] Attempting fallback search query...');
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('blog_posts')
            .select('id, title, slug')
            .eq('status', 'published')
            .ilike('title', `%${debouncedSearchQuery}%`)
            .limit(5);

          if (fallbackError) throw fallbackError;
          
          console.log(`[useBlogSearch] Fallback search successful. Found ${fallbackData?.length || 0} results.`);
          setSearchResults(fallbackData || []);
          
        } catch (fallbackErr) {
          console.error('[useBlogSearch] Fallback search failed:', fallbackErr);
          setError(fallbackErr.message);
          setSearchResults([]);
        }
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const getCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[useBlogSearch] Error fetching categories:', error);
      return [];
    }
  }, []);

  return {
    searchQuery,
    debouncedSearchQuery,
    searchResults,
    isSearching,
    error,
    getCategories
  };
};
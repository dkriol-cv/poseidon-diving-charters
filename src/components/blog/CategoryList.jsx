import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { FolderOpen, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogContext } from '@/contexts/BlogContext';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useContext(BlogContext);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('category')
          .eq('status', 'published')
          .is('deleted_at', null);

        if (error) throw error;

        // Extract unique categories and count posts per category
        const categoryCounts = {};
        data.forEach(post => {
          const cat = post.category || 'General';
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // Convert to array and sort by post count (descending)
        const categoryArray = Object.entries(categoryCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setCategories(categoryArray);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin text-[#03c4c9] w-6 h-6" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">No categories yet.</p>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map(category => (
        <Link
          key={category.name}
          to={`/blog?category=${encodeURIComponent(category.name)}`}
          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#03c4c9] group"
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-gray-400 group-hover:text-[#03c4c9] transition-colors" />
            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#03c4c9] transition-colors">
              {category.name}
            </span>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-normal group-hover:bg-[#03c4c9] group-hover:text-white transition-colors"
          >
            {category.count}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
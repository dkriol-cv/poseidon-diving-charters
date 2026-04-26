import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, TrendingUp, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useBlogSearch } from '@/hooks/useBlogSearch';
import PopularPosts from './PopularPosts';
import TagCloud from './TagCloud';
import CategoryList from './CategoryList';

const BlogSidebar = ({ onFilterChange, currentFilters = {} }) => {
  const [searchInput, setSearchInput] = useState('');
  const { 
    searchQuery, 
    debouncedSearchQuery, 
    searchResults, 
    isSearching,
    getCategories
  } = useBlogSearch(searchInput);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCats = await getCategories();
      setCategories(fetchedCats);
    };
    loadCategories();
  }, [getCategories]);

  useEffect(() => {
    if (onFilterChange && debouncedSearchQuery !== currentFilters.search) {
      onFilterChange({ ...currentFilters, search: debouncedSearchQuery });
    }
  }, [debouncedSearchQuery, onFilterChange, currentFilters]);

  const handleCategoryClick = (categorySlug) => {
    const newCategory = currentFilters.category === categorySlug ? null : categorySlug;
    if (onFilterChange) {
      onFilterChange({ ...currentFilters, category: newCategory, page: 1 });
    }
  };

  const handleTagClick = (tag) => {
    const newTag = currentFilters.tag === tag ? null : tag;
    if (onFilterChange) {
      onFilterChange({ ...currentFilters, tag: newTag, page: 1 });
    }
  };

  return (
    <aside className="space-y-8">
      {/* Search */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-4 font-futura flex items-center gap-2">
          <Search size={18} className="text-[#03c4c9]" /> Search
        </h3>
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search articles..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-transparent focus:border-[#03c4c9] focus:bg-white dark:focus:bg-gray-700"
          />
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        </div>
        {isSearching && <p className="text-xs text-gray-500 mt-2">Searching...</p>}
        {searchInput && !isSearching && searchResults.length === 0 && (
          <p className="text-xs text-gray-500 mt-2">No results found.</p>
        )}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Results</p>
            {searchResults.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                <p className="text-sm font-medium text-[#2d353b] dark:text-gray-200 group-hover:text-[#03c4c9] line-clamp-2 transition-colors">
                  {post.title}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Categories - Dynamic from blog_posts */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-4 font-futura flex items-center gap-2">
          <Filter size={18} className="text-[#03c4c9]" /> Categories
        </h3>
        <CategoryList />
      </div>

      {/* Tags */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-4 font-futura flex items-center gap-2">
          <Tag size={18} className="text-[#03c4c9]" /> Tags
        </h3>
        <TagCloud currentTag={currentFilters.tag} onTagClick={handleTagClick} />
      </div>

      {/* Popular Posts */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#2d353b] dark:text-white mb-4 font-futura flex items-center gap-2">
          <TrendingUp size={18} className="text-[#03c4c9]" /> Popular Posts
        </h3>
        <PopularPosts />
      </div>
    </aside>
  );
};

export default BlogSidebar;
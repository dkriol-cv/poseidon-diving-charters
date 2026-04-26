import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { formatBlogDate, getReadableCategory } from '@/lib/blogHelpers';
import { Card, CardContent } from '@/components/ui/card';

const BlogCard = ({ post }) => {
  if (!post) return null;

  const categoryInfo = getReadableCategory(post.category);

  return (
    <Link to={`/blog/${post.slug}`} className="block h-full group">
      <Card className="h-full overflow-hidden flex flex-col rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 bg-white">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt={post.featured_image_alt || post.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
              No Image
            </div>
          )}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${categoryInfo.color}`}>
                {categoryInfo.name}
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="flex flex-col flex-grow p-5 sm:p-6">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-medium">
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-[#03c4c9]" />
              {formatBlogDate(post.published_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-[#03c4c9]" />
              {post.reading_time || 5} min read
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-[#2d353b] mb-3 line-clamp-2 leading-tight font-futura group-hover:text-[#03c4c9] transition-colors">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {post.excerpt}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-100 text-[#03c4c9] font-bold text-sm flex items-center group-hover:text-[#f5c842] transition-colors">
            Read Article <span className="ml-1 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
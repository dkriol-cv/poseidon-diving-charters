import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FeaturedPostCard = ({ post }) => {
  if (!post) return null;

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 mb-12">
      <div className="flex flex-col lg:flex-row min-h-[400px]">
        {/* Image Section - Ocupa 55% da largura */}
        <div className="lg:w-[55%] relative overflow-hidden bg-gray-100">
          {post.featured_image_url ? (
            <img
              src={post.featured_image_url}
              alt={post.title}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Content Section - Ocupa 45% da largura */}
        <div className="lg:w-[45%] p-8 md:p-10 flex flex-col justify-center bg-white">
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded bg-[#f5c842] text-[#2d353b]">
              Featured
            </span>
            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded bg-[#03c4c9] text-white">
              Diving
            </span>
          </div>

          {/* Title - Reduzido para não quebrar o layout */}
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#2d353b] mb-4 leading-tight tracking-tight">
            <Link to={`/blog/${post.slug}`} className="hover:text-[#03c4c9] transition-colors">
              {post.title}
            </Link>
          </h2>

          {/* Excerpt - Restaurado */}
          <p className="text-[#8c959f] text-base md:text-md mb-8 line-clamp-3 leading-relaxed">
            {post.excerpt || "Discover the hidden wonders of the Algarve coastline with our expert guides..."}
          </p>

          {/* Button */}
          <div className="mt-2">
            <Button asChild className="bg-[#03c4c9] hover:bg-[#2d353b] text-white font-bold text-[11px] h-11 px-8 rounded-lg uppercase tracking-widest transition-all duration-300 shadow-none border-none">
              <Link to={`/blog/${post.slug}`}>Read Article</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostCard;
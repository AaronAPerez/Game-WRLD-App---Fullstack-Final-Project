import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Filter } from 'lucide-react';
import { useState } from 'react';
import { BlogCard } from './BlogCard';
import { blogService } from '../../api/blog';
import type { BlogPostDTO } from '@/types/blog';

const ITEMS_PER_PAGE = 9;

interface BlogListProps {
  userId?: number;
  category?: string;
  showFilters?: boolean;
}

export const BlogList = ({ userId, category, showFilters = true }: BlogListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs', userId, selectedCategory, sortBy, currentPage],
    queryFn: () => 
      blogService.getBlogs({
        userId,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        sortBy,
        page: currentPage,
        pageSize: ITEMS_PER_PAGE
      })
  });

  const categories = [
    'all',
    'Gaming News',
    'Reviews',
    'Guides',
    'Opinion',
    'Esports'
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!blogs?.data.length) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-400">No blog posts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showFilters && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'popular')}
              className="rounded-lg bg-stone-800 px-3 py-2 text-sm text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence>
          {blogs.data.map((blog: BlogPostDTO) => (
            <motion.div
              key={blog.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {blogs.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {[...Array(blogs.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`h-8 w-8 rounded-full ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-stone-800 text-gray-400 hover:bg-stone-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
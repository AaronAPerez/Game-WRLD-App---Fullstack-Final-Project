import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, PenSquare, TrendingUp } from 'lucide-react';
import { blogService } from '@/services/blogService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/styles';
import BlogPost from '../blog/BlogPost';

const CATEGORIES = ['All', 'Reviews', 'News', 'Guides', 'Discussion'];

const BlogPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts', selectedCategory],
    queryFn: () => selectedCategory === 'All' 
      ? blogService.getPosts()
      : blogService.getPostsByCategory(selectedCategory)
  });

  const { data: trendingPosts = [] } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: () => blogService.getTrendingPosts()
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Category Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-full transition-all whitespace-nowrap",
                      selectedCategory === category
                        ? "bg-indigo-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreatePost(true)}
                className={cn(
                  "hidden md:flex items-center gap-2 px-4 py-2 rounded-full",
                  "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                )}
              >
                <PenSquare className="w-4 h-4" />
                Write Post
              </button>
            </div>

            {/* Posts List */}
            {isLoading ? (
              // Loading skeletons
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-800 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BlogPost post={post} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Posts */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-medium text-white">Trending</h2>
              </div>
              <div className="space-y-4">
                {trendingPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-white">{post.title}</h3>
                      <p className="text-sm text-gray-400">{post.publisherName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-medium text-white">Filters</h2>
              </div>
              {/* Add filter options here */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Create Post Button */}
      <button
        onClick={() => setShowCreatePost(true)}
        className={cn(
          "md:hidden fixed right-4 bottom-4 p-4 rounded-full",
          "bg-indigo-600 text-white shadow-lg",
          "hover:bg-indigo-700 transition-colors"
        )}
      >
        <PenSquare className="w-6 h-6" />
      </button>
    </div>
  );
}

export default BlogPage;
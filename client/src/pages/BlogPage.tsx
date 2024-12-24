import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BlogList } from '../components/blog/BlogList';
import BlogEditor from '../components/blog/BlogEditor';
import { BlogErrorBoundary } from '../components/blog/BlogErrorBoundary';
import { useAuth } from '../hooks/useAuth';





function BlogPage() {
  const { user, logout } = useAuth();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [
    'all',
    'Gaming News',
    'Reviews',
    'Guides',
    'Opinion',
    'Esports'
  ];

  return (
    <BlogErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Blog</h1>
              <p className="text-gray-400">Share your gaming thoughts and experiences</p>
            </div>
            {user && (
              <button
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Post</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-stone-800 text-gray-400 hover:bg-stone-700 hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Blog Editor Modal */}
        {isEditorOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-stone-900 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create New Post</h2>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <BlogEditor
                onSuccess={() => {
                  setIsEditorOpen(false);
                }}
              />
            </motion.div>
          </div>
        )}

        {/* Blog List */}
        <BlogList
          category={selectedCategory === 'all' ? undefined : selectedCategory}
          showFilters={false}
        />

         {/* {!user && (
          <Alert className="mt-8 bg-stone-800 border-indigo-500/20">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">
                  Sign in to create your own blog posts and join the discussion
                </span>
                <a
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </a>
              </div>
            </AlertDescription>
          </Alert>
        )}  */}
      </div>
    </BlogErrorBoundary>
  );
};

export default BlogPage;



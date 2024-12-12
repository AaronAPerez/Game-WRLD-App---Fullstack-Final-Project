import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Loader2, Edit3, Trash2 } from 'lucide-react';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogPost, blogService } from '../services/BlogService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import BlogEditor from '../components/blog/BlogEditor';

const BlogPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => blogService.getAllPosts()
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (postId: number) => blogService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post deleted successfully');
    }
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteMutation.mutateAsync(postId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400">Share your gaming experiences</p>
        </div>
        <button
          onClick={() => {
            setEditingPost(null);
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      {/* Blog Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </h2>
            <BlogEditor
              initialData={editingPost}
              onSuccess={() => setIsEditing(false)}
              isEditing={!!editingPost}
            />
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post: BlogPost) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <BlogCard blog={post}>
                {post.userId === user?.userId && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </BlogCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;
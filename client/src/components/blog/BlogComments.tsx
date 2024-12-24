import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, MessageCircle, ThumbsUp, Flag, Trash } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { blogService } from '../../api/blog';
import toast from 'react-hot-toast';
import { BlogCommentDTO } from '../../types/blog';


interface BlogCommentsProps {
  blogId: number;
}

export const BlogComments = ({ blogId }: BlogCommentsProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  // Fetch comments
  const { data: comments, isLoading } = useQuery({
    queryKey: ['blog-comments', blogId],
    queryFn: () => blogService.getBlogComments(blogId)
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => 
      blogService.addComment(blogId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', blogId] });
      setComment('');
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => 
      blogService.deleteComment(blogId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', blogId] });
      toast.success('Comment deleted');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addCommentMutation.mutate(comment);
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-gray-400" />
        <h3 className="text-xl font-bold text-white">
          Comments ({comments?.length || 0})
        </h3>
      </div>

      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-lg border border-stone-700 bg-stone-800 p-4 text-white placeholder-gray-400"
            rows={3}
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending || !comment.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {addCommentMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </span>
            ) : (
              'Post Comment'
            )}
          </button>
        </form>
      )}

      {/* Comments List */}
      <AnimatePresence>
        <motion.div className="space-y-4">
          {comments?.map((comment: BlogCommentDTO) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-lg bg-stone-800 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {comment.userName[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{comment.userName}</p>
                    <p className="text-sm text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                {user?.userId === comment.userId && (
                  <button
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p className="mt-2 text-gray-300">{comment.content}</p>

              <div className="mt-4 flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">{comment.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-400">
                  <Flag className="h-4 w-4" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {comments?.length === 0 && (
        <p className="text-center text-gray-400">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default BlogComments;
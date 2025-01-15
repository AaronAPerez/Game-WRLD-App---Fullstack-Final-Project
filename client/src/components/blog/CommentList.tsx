import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MoreHorizontal, Loader2 } from 'lucide-react';
import { blogService } from '@/services/blogService';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BLOG_KEYS } from '@/constants/queryKeys';


interface CommentListProps {
  postId: number;
}

export const CommentList = ({ postId }: CommentListProps) => {
  const { user } = useAuth();
const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: BLOG_KEYS.comments(postId),
    queryFn: () => blogService.getComments(postId)
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => 
      blogService.addComment({ postId, content }),
    onSuccess: () => {
    //   queryClient.invalidateQueries(BLOG_KEYS.comments(postId));
      setNewComment('');
      toast.success('Comment added successfully!');
    },
    onError: () => {
      toast.error('Failed to add comment');
    }
  });

  // Like comment mutation (placeholder)
  const likeCommentMutation = useMutation({
    mutationFn: (commentId: number) => 
      blogService.likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(BLOG_KEYS.comments(postId));
}
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      await addCommentMutation.mutateAsync(newComment);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-gray-800 rounded-lg p-3 text-white resize-none min-h-[80px]
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || addCommentMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-full 
                hover:bg-blue-700 transition-colors disabled:opacity-50
                disabled:cursor-not-allowed flex items-center gap-2"
            >
              {addCommentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/4" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
                
                {/* Comment Content */}
                <div className="flex-1">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">
                          {comment.publisherName}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true
                          })}
                        </p>
                      </div>
                      
                      {/* Comment Actions Dropdown */}
                      {user?.id === comment.userId && (
                        <button className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    
                    <p className="text-gray-100 mt-2">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <button
                        // onClick={() => likeCommentMutation.mutate(comment.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Handle reply submission
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Write a reply..."
                          className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-white
                            focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-full
                            hover:bg-blue-700 transition-colors"
                        >
                          Reply
                        </button>
                      </form>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
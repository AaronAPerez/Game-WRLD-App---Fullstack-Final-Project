import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

import { BlogPost as BlogPostType } from '@/types/blog';

import { formatDistance } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/blogService';
import { CommentList } from './CommentList';

interface BlogPostProps {
  post: BlogPostType;
}

export const BlogPost = ({ post }: BlogPostProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      if (isLiked) {
        await blogService.unlikePost(post.id);
        setLikesCount(prev => prev - 1);
      } else {
        await blogService.likePost(post.id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-700" />
        <div>
          <h3 className="font-medium text-white">{post.publisherName}</h3>
          <p className="text-sm text-gray-400">
            {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-100 mb-4">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt=""
          className="rounded-xl mb-4 max-h-96 w-full object-cover"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-400">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
            isLiked ? 'text-red-500' : ''
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>{likesCount}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </button>
        
        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
          <Share2 className="w-5 h-5" />
          <span>{post.stats?.reposts || 0}</span>
        </button>
        
        <button className="flex items-center gap-2 hover:text-yellow-500 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Comments */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-800"
          >
            <CommentList postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
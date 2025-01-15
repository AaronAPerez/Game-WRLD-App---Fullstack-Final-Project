// components/social/PostCard.tsx
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Post } from '../../types/social';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import MediaGallery from '../games/MediaGallery';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar}
            alt={post.user.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">
              {post.user.username}
            </h3>
            <time className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </time>
          </div>
        </div>

        {/* Game Badge (if post is about a game) */}
        {post.game && (
          <Link 
            to={`/games/${post.game.id}`}
            className="flex items-center gap-2 px-3 py-1 bg-gray-700/50
                      rounded-full hover:bg-gray-700 transition-colors"
          >
            <img
              src={post.game.image}
              alt={post.game.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-300">
              {post.game.name}
            </span>
          </Link>
        )}
      </div>

      {/* Post Content */}
      <div className="px-4 py-2">
        <p className="text-white">{post.content}</p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="mt-2">
          <MediaGallery media={post.media} />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 flex items-center gap-6 border-t border-gray-700">
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-500">
          <Heart className="w-5 h-5" />
          <span>{post.likes}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments.length}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Comments Section */}
      <Comments comments={post.comments} />
    </motion.article>
  );
};


export default PostCard;
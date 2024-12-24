import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, Heart } from 'lucide-react';
import { BlogPostDTO } from '../../types/blog';

interface BlogCardProps {
  blog: BlogPostDTO;
  className?: string;
}

const BlogCard = ({ blog, className }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group overflow-hidden rounded-lg bg-stone-900/50 border border-stone-800/50 transition-all ${className}`}
    >
      <Link to={`/blog/${blog.id}`} className="block">
        {blog.image && (
          <div className="aspect-video overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent z-10" />
            <img
              src={blog.image}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="mb-4 flex items-center gap-4">
            <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm text-indigo-400">
              {blog.category}
            </span>
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
            </span>
          </div>

          <h2 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-indigo-400">
            {blog.title}
          </h2>

          <p className="mb-4 text-gray-400 line-clamp-2">{blog.description}</p>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {blog.publisherName[0].toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-400">{blog.publisherName}</span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span>{blog.likes || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{blog.commentsCount || 0}</span>
              </div>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-800/50 px-3 py-1 text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
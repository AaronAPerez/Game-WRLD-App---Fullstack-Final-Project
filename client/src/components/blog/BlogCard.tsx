import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MessageCircle, User } from 'lucide-react';

interface BlogCardProps {
  blog: BlogPostDTO;
  className?: string;
}

export const BlogCard = ({ blog, className }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-hidden rounded-lg bg-stone-800 shadow-lg transition-all hover:shadow-xl ${className}`}
    >
      {blog.image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-4 flex items-center gap-4">
          <span className="inline-block rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-500">
            {blog.category}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </div>
        </div>

        <Link to={`/blog/${blog.id}`}>
          <h2 className="mb-2 text-xl font-bold text-white hover:text-blue-400">
            {blog.title}
          </h2>
        </Link>

        <p className="mb-4 text-gray-400 line-clamp-3">{blog.description}</p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">{blog.publisherName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MessageCircle className="h-4 w-4" />
            <span>{blog.commentsCount || 0} comments</span>
          </div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-700 px-3 py-1 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default BlogCard;
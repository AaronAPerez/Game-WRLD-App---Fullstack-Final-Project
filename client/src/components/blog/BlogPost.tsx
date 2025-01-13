import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { UserAvatar } from '../user/UserAvatar';

interface BlogPostProps {
  post: {
    id: number;
    content: string;
    image?: string;
    author: {
      id: number;
      name: string;
      username: string;
      avatar?: string;
    };
    createdAt: string;
    likes: number;
    comments: number;
  };
}

export const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <motion.article 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 border-b border-stone-800 hover:bg-stone-900/50 transition-colors"
    >
      <div className="flex gap-4">
        <UserAvatar user={post.author} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white hover:underline">
                {post.author.name}
              </span>
              <span className="text-gray-500">@{post.author.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 hover:underline">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <button className="p-2 text-gray-500 hover:text-blue-400 rounded-full hover:bg-blue-500/20">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-2 text-white whitespace-pre-wrap">{post.content}</p>

          {post.image && (
            <img 
              src={post.image}
              alt=""
              className="mt-4 rounded-2xl border border-stone-800 max-h-[512px] object-cover w-full"
            />
          )}

          <div className="flex justify-between mt-4 max-w-md">
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 group">
              <div className="p-2 rounded-full group-hover:bg-blue-500/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span>{post.comments}</span>
            </button>

            <button className="flex items-center gap-2 text-gray-500 hover:text-pink-400 group">
              <div className="p-2 rounded-full group-hover:bg-pink-500/20">
                <Heart className="w-5 h-5" />
              </div>
              <span>{post.likes}</span>
            </button>

            <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 group">
              <div className="p-2 rounded-full group-hover:bg-green-500/20">
                <Share2 className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
// import { useState } from 'react';
// import { useBlogPost } from '../../hooks/useBlog';

// import { BlogEditForm } from './BlogEditForm';
// import { Edit2, Trash2 } from 'lucide-react';
// import { useBlogPosts } from '../../hooks/useBlog';

// interface BlogPostProps {
//   blog: BlogItemModel;
// }

// export const BlogPost = ({ blog }: BlogPostProps) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const { updatePost, deletePost } = useBlogPost();

//   const handleDelete = () => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       deletePost({ userId: blog.userId, blogId: blog.id });
//     }
//   };

//   return (
//     <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
//       {isEditing ? (
//         <BlogEditForm
//           blog={blog} 
//           onSubmit={(updatedBlog) => {
//             updatePost(updatedBlog);
//             setIsEditing(false);
//           }}
//           onCancel={() => setIsEditing(false)}
//         />
//       ) : (
//         <div>
//           <div className="flex justify-between items-start">
//             <h2 className="text-xl font-bold text-white">{blog.title}</h2>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="p-2 text-gray-400 hover:text-white rounded-lg"
//               >
//                 <Edit2 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="p-2 text-red-400 hover:text-red-300 rounded-lg"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//           <p className="text-gray-400 mt-2">{blog.description}</p>
//         </div>
//       )}
//     </div>
//   );
// };

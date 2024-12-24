import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { BlogItemModel } from '../../types/models';
import { BlogEditForm } from './BlogEditForm';


interface BlogPostProps {
  blog: BlogItemModel;
}

export const BlogPost = ({ blog }: BlogPostProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updatePost, deletePost } = useBlog();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost({ userId: blog.userId, blogId: blog.id });
    }
  };

  return (
    <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
      {isEditing ? (
        <BlogEditForm
          blog={blog} 
          onSubmit={(updatedBlog) => {
            updatePost(updatedBlog);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-white">{blog.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-400 hover:text-red-300 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-400 mt-2">{blog.description}</p>
        </div>
      )}
    </div>
  );
};
function useBlog(): { updatePost: any; deletePost: any; } {
  throw new Error('Function not implemented.');
}


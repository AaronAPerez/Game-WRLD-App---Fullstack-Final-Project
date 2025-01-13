import React from 'react';
import { usePosts } from '../hooks/usePosts';
import { Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CreatePostDto } from '../types/social';

// Post Creation Component
export const CreatePost = () => {
  const { user } = useAuth();
  const { createPost, isCreating } = usePosts();
  const [image, setImage] = React.useState<File | null>(null);
  const [content, setContent] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newPost: CreatePostDto = {
      userId: user.id,
      publisherName: user.username,
      title: content.slice(0, 50),
      description: content,
      tag: 'general',
      category: 'discussion',
    };

    createPost(newPost);
    setContent('');
    setImage(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[100px] focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Share your gaming thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => document.getElementById('file-input')?.click()}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <Image className="w-5 h-5" />
              Add Image
            </button>
            <input
              id="file-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          
          <button
            type="submit"
            disabled={isCreating || !content.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isCreating ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@headlessui/react';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { blogService } from '@/services/blogService';
import { cn } from '@/utils/styles';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Gaming News', 'Reviews', 'Guides', 'Discussion'];

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    category: CATEGORIES[0],
    image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const createPostMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('User not authenticated');

      const blogPost = {
        userId: user.id,
        publisherName: user.username,
        ...data,
        isPublished: true,
        isDeleted: false,
        date: new Date().toISOString()
      };

      return blogService.createPost(blogPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post created successfully!');
      onClose();
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tag: '',
      category: CATEGORIES[0],
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    createPostMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-gray-900 rounded-xl shadow-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-semibold text-white">
                Create Post
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                    border border-gray-700 focus:border-indigo-500 focus:ring-2 
                    focus:ring-indigo-500 focus:ring-opacity-50"
                  placeholder="Enter post title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                  Content
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                    border border-gray-700 focus:border-indigo-500 focus:ring-2 
                    focus:ring-indigo-500 focus:ring-opacity-50 resize-none"
                  placeholder="Write your post content..."
                />
              </div>

              {/* Category and Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                      border border-gray-700 focus:border-indigo-500 focus:ring-2 
                      focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-200 mb-2">
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg 
                      border border-gray-700 focus:border-indigo-500 focus:ring-2 
                      focus:ring-indigo-500 focus:ring-opacity-50"
                    placeholder="Add tags (comma separated)"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 
                  border-dashed rounded-lg hover:border-indigo-500 transition-colors cursor-pointer">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto h-32 w-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full 
                            text-white hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-400">
                          <label htmlFor="image-upload" className="relative cursor-pointer 
                            rounded-md font-medium text-indigo-500 hover:text-indigo-400">
                            <span>Upload an image</span>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={createPostMutation.isPending}
                  className={cn(
                    "px-6 py-2 text-white font-medium rounded-lg",
                    "bg-indigo-600 hover:bg-indigo-700 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center gap-2"
                  )}
                >
                  {createPostMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default CreatePostModal
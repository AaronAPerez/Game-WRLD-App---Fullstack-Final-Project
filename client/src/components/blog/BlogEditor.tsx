import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, X, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../BlogService';


const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogEditorProps {
  onSuccess?: () => void;
  initialData?: BlogFormData;
  isEditing?: boolean;
  blogId?: number;
}

export const BlogEditor = ({ onSuccess, initialData, isEditing, blogId }: BlogEditorProps) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData
  });

  const mutation = useMutation({
    mutationFn: (data: CreateBlogPostDTO) => 
      isEditing 
        ? blogService.updateBlog(blogId!, data)
        : blogService.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success(isEditing ? 'Blog updated successfully!' : 'Blog created successfully!');
      reset();
      setTags([]);
      onSuccess?.();
    },
    onError: () => {
      toast.error(isEditing ? 'Failed to update blog' : 'Failed to create blog');
    }
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = (data: BlogFormData) => {
    mutation.mutate({
      ...data,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-white"
          placeholder="Enter blog title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Content
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          className="mt-1 block w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-white"
          placeholder="Write your blog content here..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Category Select */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <select
          id="category"
          {...register('category')}
          className="mt-1 block w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-white"
        >
          <option value="">Select a category</option>
          <option value="Gaming News">Gaming News</option>
          <option value="Reviews">Reviews</option>
          <option value="Guides">Guides</option>
          <option value="Opinion">Opinion</option>
          <option value="Esports">Esports</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Tags Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Tags</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-blue-400 hover:text-blue-300"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="flex-1 rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-white"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300">Cover Image</label>
        <div className="mt-1 flex items-center gap-4">
          <input
            type="text"
            {...register('image')}
            className="flex-1 rounded-lg border border-stone-700 bg-stone-800 px-4 py-2 text-white"
            placeholder="Enter image URL"
          />
          <button
            type="button"
            className="rounded-lg bg-stone-700 px-4 py-2 text-white hover:bg-stone-600"
          >
            <ImagePlus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {mutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {isEditing ? 'Updating...' : 'Publishing...'}
            </span>
          ) : (
            <span>{isEditing ? 'Update Blog' : 'Publish Blog'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogEditor;
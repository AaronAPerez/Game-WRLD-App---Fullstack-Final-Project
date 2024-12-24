import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBlogPostDTO } from '../../types/blog';
import { cn } from '../../utils/styles';

// Define the form schema using Zod
const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// Create a type from the schema
type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  onSubmit: (data: CreateBlogPostDTO) => Promise<void>;
  initialData?: Partial<CreateBlogPostDTO>;
  isSubmitting?: boolean;
}

export function BlogForm({ onSubmit, initialData, isSubmitting }: BlogFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData
  });

  const handleFormSubmit = async (data: BlogFormData) => {
    try {
      await onSubmit(data as CreateBlogPostDTO);
      reset();
    } catch (error) {
      console.error('Failed to submit form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={cn(
            "mt-1 block w-full rounded-lg border px-4 py-2",
            "bg-stone-800 text-white border-stone-700",
            "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
            errors.title && "border-red-500"
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Content
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          className={cn(
            "mt-1 block w-full rounded-lg border px-4 py-2",
            "bg-stone-800 text-white border-stone-700",
            "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
            errors.description && "border-red-500"
          )}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300">
          Category
        </label>
        <select
          id="category"
          {...register('category')}
          className={cn(
            "mt-1 block w-full rounded-lg border px-4 py-2",
            "bg-stone-800 text-white border-stone-700",
            "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
            errors.category && "border-red-500"
          )}
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

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
          Image URL
        </label>
        <input
          id="image"
          type="text"
          {...register('image')}
          className={cn(
            "mt-1 block w-full rounded-lg border px-4 py-2",
            "bg-stone-800 text-white border-stone-700",
            "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          )}
          placeholder="Enter image URL (optional)"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full px-4 py-2 rounded-lg font-medium",
          "bg-indigo-600 text-white",
          "hover:bg-indigo-700 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isSubmitting ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
}
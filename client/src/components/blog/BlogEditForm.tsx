import { useState } from 'react';
import { BlogItemModel } from '../../types/models';

interface BlogEditFormProps {
  blog: BlogItemModel;
  onSubmit: (blog: BlogItemModel) => void;
  onCancel: () => void;
}

export const BlogEditForm = ({ blog, onSubmit, onCancel }: BlogEditFormProps) => {
  const [formData, setFormData] = useState(blog);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-3 py-2 bg-stone-800 rounded-lg text-white"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-3 py-2 bg-stone-800 rounded-lg text-white h-32"
        required
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
import { useComments } from '@/hooks/useComments';
import { useState } from 'react';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
}

export const CommentForm = ({ postId, parentId, onSuccess }: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { addComment } = useComments(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    await addComment({
      postId,
      content,
      parentCommentId: parentId
    });
    
    setContent('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-800 text-white resize-none focus:ring-2 focus:ring-purple-500"
        placeholder="Add a comment..."
        rows={3}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        disabled={!content.trim()}
      >
        Post Comment
      </button>
    </form>
  );
};
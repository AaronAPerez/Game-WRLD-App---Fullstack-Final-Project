import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Image as ImageIcon, 
  File, 
  X, 
  Upload,
  Loader2,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { cn } from '../../utils/styles';

interface MediaPreview {
  id: string;
  file: File;
  type: 'image' | 'file';
  previewUrl?: string;
}

interface ChatMediaHandlerProps {
  roomId?: number;
  receiverId?: number;
  onMediaSelect: (files: File[]) => void;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 5;

export function ChatMediaHandler({ 
  roomId, 
  receiverId, 
  onMediaSelect 
}: ChatMediaHandlerProps) {
  const [previews, setPreviews] = useState<MediaPreview[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      
      if (roomId) {
        formData.append('roomId', roomId.toString());
      } else if (receiverId) {
        formData.append('receiverId', receiverId.toString());
      }

      return chatService.uploadFiles(formData);
    },
    onSuccess: () => {
      setPreviews([]);
      if (roomId) {
        queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
      } else if (receiverId) {
        queryClient.invalidateQueries({ queryKey: ['directMessages', receiverId] });
      }
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= MAX_FILE_SIZE;
      const isValidType = ALLOWED_IMAGE_TYPES.includes(file.type) || file.type.startsWith('application/');
      return isValidSize && isValidType;
    });

    if (validFiles.length + previews.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files at once`);
      return;
    }

    const newPreviews = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      type: file.type.startsWith('image/') ? 'image' : 'file' as const,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
    onMediaSelect(validFiles);
  };

  const handleRemoveFile = (id: string) => {
    setPreviews(prev => {
      const removedPreview = prev.find(p => p.id === id);
      if (removedPreview?.previewUrl) {
        URL.revokeObjectURL(removedPreview.previewUrl);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={[...ALLOWED_IMAGE_TYPES, 'application/*'].join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 space-y-2"
          >
            <div className="flex flex-wrap gap-2">
              {previews.map((preview) => (
                <div
                  key={preview.id}
                  className="relative group"
                >
                  {preview.type === 'image' ? (
                    <div className="relative w-20 h-20">
                      <img
                        src={preview.previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        onClick={() => setPreviewImage(preview.previewUrl!)}
                      />
                      <button
                        onClick={() => handleRemoveFile(preview.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-20 h-20 bg-stone-800 rounded-lg flex flex-col items-center justify-center p-2">
                      <File className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-400 truncate w-full text-center">
                        {preview.file.name}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(preview.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => uploadMutation.mutate(previews.map(p => p.file))}
                disabled={uploadMutation.isPending}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-indigo-500 text-white",
                  "hover:bg-indigo-600 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-size image preview */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
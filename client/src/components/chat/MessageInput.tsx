import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip, Image, X, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import { cn } from '../../utils/styles';


interface MessageInputProps {
  roomId: number;
  onTyping?: () => void;
}

export function MessageInput({ roomId, onTyping }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '0px';
      inputRef.current.style.height = 
        `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    if (message && onTyping) {
      onTyping();
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        // Stop typing indicator
      }, 3000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, onTyping]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!message.trim() && files.length === 0) return;

      // Handle text message
      if (message.trim()) {
        await chatService.sendMessage(roomId, message.trim());
      }

      // Handle file uploads
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('roomId', roomId.toString());
        await chatService.uploadFile(formData);
      }

      // Clear input
      setMessage('');
      setFiles([]);
      inputRef.current?.focus();
    }
  });

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  // Handle emoji selection
//   const handleEmojiSelect = (emoji: string) => {
//     setMessage(prev => prev + emoji);
//     setShowEmojiPicker(false);
//     inputRef.current?.focus();
//   };

  return (
    <div className="p-4 border-t border-stone-800">
      {/* File previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex gap-2 mb-2 overflow-x-auto"
          >
            {files.map((file, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Upload preview"
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-stone-800">
                    <Paperclip className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessageMutation.mutate();
              }
            }}
            placeholder="Type a message..."
            className={cn(
              "w-full px-4 py-2 bg-stone-800 rounded-lg text-white",
              "resize-none min-h-[40px] max-h-[150px]",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500"
            )}
            disabled={sendMessageMutation.isPending}
          />

          <div className="absolute bottom-2 right-2 flex gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-stone-700"
            >
              <Smile className="w-5 h-5" />
            </button>
            <label className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-stone-700 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              <Image className="w-5 h-5" />
            </label>
            <label className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-stone-700 cursor-pointer">
              <input
                type="file"
                onChange={handleFileSelect}
                multiple
                className="hidden"
              />
              <Paperclip className="w-5 h-5" />
            </label>
          </div>
        </div>

        <button
          onClick={() => sendMessageMutation.mutate()}
          disabled={(!message.trim() && files.length === 0) || sendMessageMutation.isPending}
          className={cn(
            "p-2 rounded-lg transition-colors",
            message.trim() || files.length > 0
              ? "bg-indigo-500 text-white hover:bg-indigo-600"
              : "bg-stone-800 text-gray-400 cursor-not-allowed"
          )}
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Emoji Picker */}
      {/* <AnimatePresence>
        {showEmojiPicker && (
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
}
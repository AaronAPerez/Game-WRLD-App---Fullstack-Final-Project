import { useState, useRef } from 'react';
import { Send, Image, Paperclip, Smile, Loader2 } from 'lucide-react';
import { cn } from '../../utils/styles';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSendMessage(message);
      setMessage('');
      inputRef.current?.focus();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-stone-800">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className={cn(
              "w-full px-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400",
              "resize-none min-h-[42px] max-h-32",
              "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            )}
            rows={1}
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-1 text-gray-400 hover:text-white transition-colors">
              <Image className="w-5 h-5" />
            </button>
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            message.trim()
              ? "text-indigo-400 hover:text-white hover:bg-stone-800"
              : "text-gray-600"
          )}
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
// components/chat/MessageReactions.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useChat } from '../../hooks/useChat';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface MessageReactionsProps {
  messageId: number;
  reactions: Array<{
    reaction: string;
    users: Array<{ id: number; username: string }>;
  }>;
}

export function MessageReactions({ messageId, reactions }: MessageReactionsProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const { connection } = useChat();

  const handleReaction = async (emoji: string) => {
    if (!connection) return;

    try {
      // Check if user already reacted with this emoji
      const existingReaction = reactions.find(r => 
        r.reaction === emoji && 
        r.users.some(u => u.id === connection.userId)
      );

      if (existingReaction) {
        await connection.invoke('RemoveReaction', messageId, emoji);
      } else {
        await connection.invoke('AddReaction', messageId, emoji);
      }
    } catch (error) {
      console.error('Failed to react:', error);
    }
    
    setShowReactionPicker(false);
  };

  return (
    <div className="relative">
      {/* Reaction counts */}
      <div className="flex flex-wrap gap-1">
        {reactions.map(({ reaction, users }) => (
          <motion.button
            key={reaction}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-sm",
              "bg-stone-800 hover:bg-stone-700 transition-colors"
            )}
            onClick={() => handleReaction(reaction)}
          >
            <span>{reaction}</span>
            <span className="text-xs text-gray-400">{users.length}</span>
          </motion.button>
        ))}

        {/* Add reaction button */}
        <button
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-stone-800"
        >
          <Smile className="w-4 h-4" />
        </button>
      </div>

      {/* Reaction picker */}
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute bottom-full mb-2 p-2 bg-stone-800 rounded-lg shadow-lg"
          >
            <div className="flex gap-1">
              {REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="p-2 hover:bg-stone-700 rounded transition-colors"
                >
                  <span className="text-lg">{emoji}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
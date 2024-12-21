import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { UserList } from './UserList';
import { cn } from '../../utils/styles';

interface ChatRoomProps {
  roomId: number;
}

export const ChatRoom = ({ roomId }: ChatRoomProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUserList, setShowUserList] = useState(false);
  const { useMessages, sendMessage, joinRoom } = useChat({
    onMessage: () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const { data: messages = [], isLoading } = useMessages(roomId);

  // Join room on mount
  useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput 
          onSend={(content) => sendMessage({ roomId, content })}
        />
      </div>

      {/* User List Sidebar */}
      {showUserList && <UserList roomId={roomId} />}
    </div>
  );
};

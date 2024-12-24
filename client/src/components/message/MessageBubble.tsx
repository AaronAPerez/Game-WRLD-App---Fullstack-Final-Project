import { ChatMessageDTO } from "../../types/chat";
import { cn } from "../../utils/styles";

// Message Bubble Component
interface MessageBubbleProps {
    message: ChatMessageDTO;
    isOwnMessage: boolean;
  }
  
  const MessageBubble = ({ message, isOwnMessage }: MessageBubbleProps) => {
    return (
      <div
        className={cn(
          "flex gap-3",
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        )}
      >
        <img
          src={message.sender.avatar || '/default-avatar.png'}
          alt={message.sender.username}
          className="w-8 h-8 rounded-full mt-1"
        />
        <div
          className={cn(
            "max-w-[70%] rounded-xl p-3",
            isOwnMessage
              ? "bg-indigo-500 text-white"
              : "bg-stone-800 text-white"
          )}
        >
          {!isOwnMessage && (
            <p className="text-xs text-gray-400 mb-1">
              {message.sender.username}
            </p>
          )}
          <p>{message.content}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs opacity-70">
              {new Date(message.sentAt).toLocaleTimeString()}
            </span>
            {message.isEdited && (
              <span className="text-xs opacity-50">(edited)</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default MessageBubble;
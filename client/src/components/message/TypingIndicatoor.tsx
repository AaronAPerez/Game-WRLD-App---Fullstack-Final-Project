import { MessageSquare } from "lucide-react";

// Typing Indicator Component
const TypingIndicator = ({ users }: { users: number[] }) => {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="flex -space-x-2">
          {users.map((userId) => (
            <div
              key={userId}
              className="w-6 h-6 rounded-full bg-stone-800 flex items-center justify-center"
            >
              <MessageSquare className="w-3 h-3" />
            </div>
          ))}
        </div>
        <span>
          {users.length === 1
            ? "Someone is typing..."
            : `${users.length} people are typing...`}
        </span>
      </div>
    );
  };

  export default TypingIndicator;
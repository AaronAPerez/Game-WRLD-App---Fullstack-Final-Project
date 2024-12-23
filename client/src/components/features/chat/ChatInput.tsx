interface ChatInputProps {
    onSend: (content: string) => Promise<void>;
  }
  
  export const ChatInput = ({ onSend }: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || isLoading) return;
  
      setIsLoading(true);
      try {
        await onSend(message);
        setMessage('');
      } catch (error) {
        toast.error('Failed to send message');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-stone-800 text-white px-4 py-2 rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={cn(
              "p-2 rounded-lg transition-colors",
              message.trim() && !isLoading
                ? "bg-indigo-500 text-white hover:bg-indigo-600"
                : "bg-stone-800 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    );
  };
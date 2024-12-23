import { ArrowLeft, Settings } from "lucide-react";
import { UserProfileDTO } from "../../types";
import { cn } from "../../utils/styles";

interface ChatHeaderProps {
    user: UserProfileDTO;
    onBack?: () => void;
    onSettings?: () => void;
  }
  
  export function ChatHeader({ user, onBack, onSettings }: ChatHeaderProps) {
    return (
      <div className="p-4 border-b border-stone-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative">
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-stone-900",
              user.status === 'online' ? "bg-green-500" : "bg-gray-500"
            )} />
          </div>
          
          <div>
            <h2 className="font-medium text-white">{user.username}</h2>
            <p className="text-sm text-gray-400">
              {user.status === 'online' ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
  
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
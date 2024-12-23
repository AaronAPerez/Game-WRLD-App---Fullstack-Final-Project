import { UserProfileDTO } from '../types';
import { cn } from '../utils/styles';


interface UserAvatarProps {
  user?: UserProfileDTO;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
}

const SIZES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
} as const;

const STATUS_INDICATORS = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  ingame: 'bg-indigo-500'
} as const;

export function UserAvatar({ 
  user, 
  username, 
  size = 'md', 
  showStatus = true 
}: UserAvatarProps) {
  const displayName = user?.username || username || 'User';
  const avatarUrl = user?.avatar || `/api/placeholder/${size === 'xl' ? '64' : '40'}/40`;
  
  return (
    <div className="relative">
      <div className={cn(
        "relative rounded-full overflow-hidden",
        SIZES[size]
      )}>
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />
      </div>
      
      {showStatus && user?.status && (
        <div className={cn(
          "absolute bottom-0 right-0 rounded-full border-2 border-stone-900",
          size === 'xl' ? 'w-4 h-4' : 'w-3 h-3',
          STATUS_INDICATORS[user.status]
        )} />
      )}
    </div>
  );
}
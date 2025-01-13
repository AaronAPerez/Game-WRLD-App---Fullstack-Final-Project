import { cn } from "../../utils/styles";

interface UserAvatarProps {
    user: {
      username: string;
      avatar?: string | null;
    };
    size?: 'sm' | 'md' | 'lg';
  }
  
  export const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
  
    return (
      <div className={cn(
        "relative rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <img
          src={user.avatar || '/default-avatar.svg'} // Path to the SVG we created
          alt={`${user.username}'s avatar`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };
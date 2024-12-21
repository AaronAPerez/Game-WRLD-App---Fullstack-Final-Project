interface NotificationToastProps {
    notification: Notification;
    onDismiss: () => void;
  }
  
  export const NotificationToast = ({ 
    notification, 
    onDismiss 
  }: NotificationToastProps) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      onDismiss();
      switch (notification.type) {
        case 'message':
          navigate(`/chat/${notification.sender.id}`);
          break;
        case 'friend_request':
          navigate('/friends/requests');
          break;
        case 'friend_accepted':
          navigate(`/profile/${notification.sender.id}`);
          break;
      }
    };
  
    return (
      <div
        role="alert"
        className={cn(
          "flex items-start gap-4 p-4 rounded-lg cursor-pointer",
          "bg-stone-900 border border-stone-800",
          "hover:bg-stone-800 transition-colors"
        )}
        onClick={handleClick}
      >
        {/* Notification Icon */}
        <div className="relative flex-shrink-0">
          <img
            src={notification.sender.avatar || '/default-avatar.png'}
            alt={notification.sender.username}
            className="w-10 h-10 rounded-full"
          />
          <div className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full",
            "flex items-center justify-center",
            notification.type === 'message' 
              ? "bg-green-500" 
              : "bg-indigo-500"
          )}>
            {notification.type === 'message' ? (
              <MessageSquare className="w-3 h-3 text-white" />
            ) : notification.type === 'friend_request' ? (
              <UserPlus className="w-3 h-3 text-white" />
            ) : (
              <Check className="w-3 h-3 text-white" />
            )}
          </div>
        </div>
  
        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white">
            {notification.title}
          </p>
          <p className="text-sm text-gray-400 truncate">
            {notification.message}
          </p>
        </div>
  
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="flex-shrink-0 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  };
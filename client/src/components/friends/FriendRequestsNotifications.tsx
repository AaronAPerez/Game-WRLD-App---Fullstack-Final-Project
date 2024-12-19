// components/chat/FriendRequestsNotifications.tsx
import { Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';

export function FriendRequestsNotifications() {
  const { data: requests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: chatService.getFriendRequests,
    refetchInterval: 30000
  });

  const pendingCount = requests?.filter(req => req.status === 'pending').length;

  return (
    <button className="relative p-2 text-gray-400 hover:text-white rounded-lg">
      <Users className="w-5 h-5" />
      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
          {pendingCount}
        </span>
      )}
    </button>
  );
}
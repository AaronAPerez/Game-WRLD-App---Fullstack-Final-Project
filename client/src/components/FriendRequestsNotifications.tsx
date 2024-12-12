import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/userService';
import { Check, X, Loader2, Users } from 'lucide-react';
import { cn } from '../utils/styles';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


interface FriendRequest {
  id: number;
  requester: {
    id: number;
    username: string;
    avatar: string | null;
  };
  createdAt: string;
}

interface FriendRequestsResponse {
  received: FriendRequest[];
  sent: FriendRequest[];
}

export const FriendRequestsNotifications = () => {
  const { isAuthenticated } = useAuth();
  const { data: requests, isLoading } = useQuery<FriendRequestsResponse>({
    queryKey: ['friendRequests'],
    queryFn: UserService.getFriendRequests,
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const handleResponse = async (requestId: number, accept: boolean) => {
    try {
      await UserService.respondToFriendRequest(requestId, accept);
      toast.success(`Friend request ${accept ? 'accepted' : 'declined'}`);
    } catch (error) {
      toast.error('Failed to respond to friend request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!requests?.received.length) {
    return (
      <div className="text-center p-4 text-gray-400">
        <button
          type="button"
          className="relative text-gray-400"
        >
          <Link to="/friends" className="hover:text-green-600">
            <Users className="h-5 w-5" />
          </Link>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests?.received.map((request: FriendRequest) => (
        <div
          key={request.id}
          className="bg-stone-900 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <img
              src={request.requester.avatar || '/api/placeholder/40/40'}
              alt={request.requester.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-white">
                {request.requester.username}
              </h3>
              <p className="text-sm text-gray-400">
                Sent {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleResponse(request.id, true)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "bg-green-500/20 text-green-400",
                "hover:bg-green-500/30"
              )}
              title="Accept request"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleResponse(request.id, false)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "bg-red-500/20 text-red-400",
                "hover:bg-red-500/30"
              )}
              title="Decline request"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
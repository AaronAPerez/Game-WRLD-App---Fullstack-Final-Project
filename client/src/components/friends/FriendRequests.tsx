import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../api/user';
import { Users } from 'lucide-react';
import { cn } from '../../utils/styles';
<<<<<<< HEAD

=======
import type { FriendRequestDTO } from '../../types';
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17

export const FriendRequests = () => {
  const [selectedTab, setSelectedTab] = useState<'received' | 'sent'>('received');
  const queryClient = useQueryClient();

  const { data: requests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: userService.getFriendRequests
  });

  const respondToRequestMutation = useMutation({
    mutationFn: userService.respondToFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['friendRequests']);
      queryClient.invalidateQueries(['friends']);
    }
  });

  if (!requests) return null;

  const currentRequests = requests[selectedTab] as FriendRequestDTO[];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-stone-800">
        {(['received', 'sent'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "pb-4 px-4 text-lg capitalize",
              selectedTab === tab
                ? "text-white border-b-2 border-indigo-500"
                : "text-gray-400 hover:text-white"
            )}
          >
            {tab} ({(requests[tab] as FriendRequestDTO[]).length})
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {currentRequests.map((request) => (
          <div
            key={request.requestId}
            className="flex items-center justify-between p-4 bg-stone-900 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={request.requester.avatar || '/default-avatar.png'}
                alt={request.requester.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="font-medium text-white">
                  {request.requester.username}
                </h4>
                <p className="text-sm text-gray-400">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {selectedTab === 'received' && (
              <div className="flex gap-2">
                <button
                  onClick={() => respondToRequestMutation.mutate({
                    requestId: request.requestId,
                    accept: true
                  })}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToRequestMutation.mutate({
                    requestId: request.requestId,
                    accept: false
                  })}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}

        {currentRequests.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">
              No {selectedTab} friend requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
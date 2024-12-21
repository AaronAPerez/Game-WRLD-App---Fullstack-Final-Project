import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Check, Loader2 } from 'lucide-react';
import { cn } from '../../utils/styles';
import { userService } from '../../services/userService';
import { toast } from 'react-hot-toast';
import type { UserProfileDTO } from '../../types/index';

interface FriendActionButtonProps {
  targetUser: UserProfileDTO;
}


export const FriendActionButton = ({ targetUser }: FriendActionButtonProps) => {
  const queryClient = useQueryClient();
  const [isRequested, setIsRequested] = useState(false);

  // Query to check existing friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: userService.getFriendRequests,
  });

  // Check if there's already a pending request
  const isPending = friendRequests?.sent?.some(
    (    request: { addressee: { id: number; }; }) => request.addressee.id === targetUser.id
  );

  // Check if users are already friends
  const isFriend = friendRequests?.received?.some(
    (    request: { status: string; requester: { id: number; }; addressee: { id: number; }; }) => 
      request.status === 'accepted' && 
      (request.requester.id === targetUser.id || request.addressee.id === targetUser.id)
  );

  // Mutation for sending friend requests
  const { mutate: sendFriendRequest, isLoading } = useMutation({
    mutationFn: () => userService.sendFriendRequest(targetUser.id),
    onSuccess: () => {
      setIsRequested(true);
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      toast.success(`Friend request sent to ${targetUser.username}`);
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

  if (isFriend) {
    return (
      <button
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
          "bg-green-500/20 text-green-400"
        )}
        disabled
      >
        <Check className="w-4 h-4" />
        <span>Friends</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => sendFriendRequest()}
      disabled={isLoading || isPending || isRequested}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
        "transition-colors",
        (isPending || isRequested) 
          ? "bg-green-500/20 text-green-400"
          : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Sending...</span>
        </>
      ) : isPending || isRequested ? (
        <>
          <Check className="w-4 h-4" />
          <span>Request Sent</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Add Friend</span>
        </>
      )}
    </button>
  );
};



// User card component
// export const UserCard = ({ user }: { user: UserProfile }) => {
//   return (
//     <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
//       {/* User info... */}
      
//       {/* Action Buttons */}
//       <div className="flex items-center gap-3 mt-6">
//         <FriendActionButton targetUser={user} />
//         <ChatActionButton targetUser={user} />
//       </div>
//     </div>
//   );
// };
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Check, Loader2 } from 'lucide-react';
import { UserService } from '../../services/userService';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';
import { UserProfile } from '../../types/chat';


interface FriendActionButtonProps {
  targetUser: UserProfile;
}

interface SendFriendRequestParams {
  addresseeId: number;
}

export const FriendActionButton = ({ targetUser }: FriendActionButtonProps) => {
  const queryClient = useQueryClient();
  const [isRequested, setIsRequested] = useState(false);

  // Friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: (params: SendFriendRequestParams) => 
      UserService.sendFriendRequest(params.addresseeId),
    onSuccess: () => {
      setIsRequested(true);
      queryClient.invalidateQueries({
        queryKey: ['friendRequests']
      });
      toast.success(`Friend request sent to ${targetUser.username}`);
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

  const handleSendRequest = () => {
    sendRequestMutation.mutate({ 
      addresseeId: targetUser.id
    });
  };

  return (
    <button
      onClick={handleSendRequest}
      disabled={isRequested || sendRequestMutation.isPending}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
        "transition-colors",
        isRequested 
          ? "bg-green-500/20 text-green-400"
          : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
      )}
    >
      {sendRequestMutation.isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Sending...</span>
        </>
      ) : isRequested ? (
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
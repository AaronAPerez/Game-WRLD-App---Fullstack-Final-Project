import { useFriendRequests } from "../../hooks/useFriendRequests";

export function FriendRequestButton({ userId }: { userId: number }) {
    const { sendRequest } = useFriendRequests();
  
    return (
      <button
        onClick={() => sendRequest.mutate(userId)}
        disabled={sendRequest.isPending}
        className="..."
      >
        {sendRequest.isPending ? 'Sending...' : 'Add Friend'}
      </button>
    );
  }
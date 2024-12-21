import { FriendRequests } from '../components/friends/FriendRequests';
import { FriendSuggestions } from '../components/friends/FriendSuggestions';
import { ActivityFeed } from '../components/friends/ActivityFeed';
import { FriendList } from '../components/friends/FriendList';


const FriendsPage = () => {

  return (
    <div className="container mx-auto px-4">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Friends List */}
        <div className="lg:col-span-2">
          <FriendList />
        </div>

         {/* Activity Feed */}
         <div>
            <h2 className="text-xl font-bold mb-4">Friend Activity</h2>
            <ActivityFeed />
               {/* Friend Requests */}
               <div className="mb-2">
        <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
        <FriendRequests />
      </div> 
               {/* Suggestions */}
      <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Suggested Friends</h2>
            <FriendSuggestions />
      </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
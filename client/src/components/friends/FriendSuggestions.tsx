// import { useQuery } from '@tanstack/react-query';
// import { UserService } from '../../services/userService';
// import { UserPlus } from 'lucide-react';

// export const FriendSuggestions = () => {
//   const { data: suggestions = [] } = useQuery({
//     queryKey: ['friendSuggestions'],
//     queryFn: UserService.getFriendSuggestions
//   });

//   return (
//     <div className="bg-stone-900 rounded-xl border border-stone-800">
//       <div className="divide-y divide-stone-800">
//         {suggestions.map((user) => (
//           <div key={user.id} className="p-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <img
//                 src={user.avatar || '/default-avatar.png'}
//                 alt={user.username}
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <p className="font-medium text-white">{user.username}</p>
//                 <p className="text-sm text-gray-400">
//                   {user.mutualFriends} mutual friends
//                 </p>
//               </div>
//             </div>
//             <button className="p-2 text-indigo-400 hover:text-indigo-300 rounded-lg hover:bg-stone-800">
//               <UserPlus className="w-5 h-5" />
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
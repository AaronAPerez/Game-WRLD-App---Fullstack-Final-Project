// import { formatDistanceToNow } from 'date-fns';
// import type { UserProfileDTO, DirectMessage } from '../../types/index';
// import { cn } from '../../utils/styles';

// interface ConversationItemProps {
//   user: UserProfileDTO;
//   lastMessage?: DirectMessage;
//   isActive: boolean;
//   onClick: () => void;
// }

// export function ConversationItem({
//   user,
//   lastMessage,
//   isActive,
//   onClick
// }: ConversationItemProps) {
//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
//         isActive && "bg-stone-800"
//       )}
//     >
//       <div className="relative">
//         <img
//           src={user.avatar || '/default-avatar.png'}
//           alt={user.username}
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <div className={cn(
//           "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-stone-800",
//           user.status === 'online' 
//             ? "bg-green-500" 
//             : user.status === 'ingame' 
//               ? "bg-indigo-500" 
//               : "bg-gray-500"
//         )} />
//       </div>

//       <div className="flex-1 min-w-0 text-left">
//         <div className="flex justify-between items-baseline">
//           <h3 className="font-medium text-white truncate">
//             {user.username}
//           </h3>
//           {lastMessage && (
//             <span className="text-xs text-gray-500 flex-shrink-0">
//               {formatDistanceToNow(new Date(lastMessage.sentAt), { addSuffix: true })}
//             </span>
//           )}
//         </div>
        
//         {lastMessage ? (
//           <p className="text-sm text-gray-400 truncate">
//             {lastMessage.content}
//           </p>
//         ) : (
//           <p className="text-sm text-gray-500">
//             No messages yet
//           </p>
//         )}
//       </div>
//     </button>
//   );
// }

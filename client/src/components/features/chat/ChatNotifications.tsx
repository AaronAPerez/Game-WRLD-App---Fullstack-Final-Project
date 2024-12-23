// import { Bell } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { chatService } from '../../../services/chatService';


// interface ChatNotificationsProps {
//   onOpenChat: () => void;
// }

// export function ChatNotifications({ onOpenChat }: ChatNotificationsProps) {
//   const { data: unreadCount } = useQuery({
//     queryKey: ['unreadMessages'],
//     queryFn: chatService.getUnreadMessagesCount,
//     refetchInterval: 10000
//   });

//   return (
//     <button
//       onClick={onOpenChat}
//       className="relative p-2 text-gray-400 hover:text-white rounded-lg"
//     >
//       <Bell className="w-5 h-5" />
//       {unreadCount > 0 && (
//         <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-xs text-white">
//           {unreadCount}
//         </span>
//       )}
//     </button>
//   );
// }
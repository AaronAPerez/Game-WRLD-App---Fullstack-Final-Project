// import { useQuery } from '@tanstack/react-query';
// import { chatService } from '../../services/chatService';
// import { useChatStore } from '../store/chatStore';
// import { Users } from 'lucide-react';
// import { cn } from '../../utils/styles';
// import type { ChatRoom } from '../../types/chat';

// interface RoomListProps {
//   searchQuery: string;
// }

// export const RoomList = ({ searchQuery }: RoomListProps) => {
//   const setActiveRoom = useChatStore(state => state.setActiveRoom);
//   const activeRoom = useChatStore(state => state.activeRoom);

//   const { data: rooms = [], isLoading } = useQuery<ChatRoom[]>({
//     queryKey: ['chatRooms'],
//     queryFn: async () => {
//       if (!chatService.getChatRooms) {
//         return [];
//       }
//       return chatService.getChatRooms();
//     },
//     initialData: []
//   });

//   const filteredRooms = rooms.filter((room: ChatRoom) => 
//     room.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (isLoading) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto">
//       {filteredRooms.map((room: ChatRoom) => (
//         <button
//           key={room.id}
//           onClick={() => setActiveRoom(room)}
//           className={cn(
//             "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
//             activeRoom?.id === room.id ? 'bg-stone-800' : ''
//           )}
//         >
//           <img
//             src={room.image || '/api/placeholder/48/48'}
//             alt={room.name}
//             className="w-12 h-12 rounded-xl"
//           />
//           <div className="flex-1 text-left">
//             <h3 className="text-white font-medium">{room.name}</h3>
//             <p className="text-sm text-gray-400 truncate">{room.description}</p>
//           </div>
//           <div className="text-xs text-gray-500 flex items-center gap-1">
//             <Users className="w-4 h-4" />
//             {room.membersCount}
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// };
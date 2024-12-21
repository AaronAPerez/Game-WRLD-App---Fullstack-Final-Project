// import { useAuth } from "../../hooks/useAuth";
// import { cn } from "../../utils/styles";

// interface ChatMessageProps {
//     message: ChatMessageDTO;
//   }
  
//   export const ChatMessage = ({ message }: ChatMessageProps) => {
//     const { user } = useAuth();
//     const isOwnMessage = message.sender.id === user?.id;
  
//     return (
//       <div
//         className={cn(
//           "flex gap-3",
//           isOwnMessage ? "flex-row-reverse" : "flex-row"
//         )}
//       >
//         <img
//           src={message.sender.avatar || '/default-avatar.png'}
//           alt={message.sender.username}
//           className="w-8 h-8 rounded-full"
//         />
//         <div
//           className={cn(
//             "max-w-[70%] p-3 rounded-xl",
//             isOwnMessage
//               ? "bg-indigo-500 text-white"
//               : "bg-stone-800 text-white"
//           )}
//         >
//           {!isOwnMessage && (
//             <p className="text-sm text-gray-400 mb-1">
//               {message.sender.username}
//             </p>
//           )}
//           <p>{message.content}</p>
//           <p className="text-xs mt-1 opacity-70">
//             {new Date(message.sentAt).toLocaleTimeString()}
//           </p>
//         </div>
//       </div>
//     );
//   };
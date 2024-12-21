import { DirectMessage } from "../../types";
import { cn } from "../../utils/styles";


interface MessageProps {
  message: DirectMessage;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageComponent = ({ message, isOwn, showAvatar = true }: MessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 items-end",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {showAvatar && !isOwn && (
        <img
          src={message.sender.avatar || '/default-avatar.png'}
          alt={message.sender.username}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      {!showAvatar && !isOwn && <div className="w-8" />}
      
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-2",
        isOwn 
          ? "bg-indigo-500 text-white" 
          : "bg-stone-800 text-gray-100"
      )}>
        <p className="break-words">{message.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs opacity-70">
            {new Date(message.sentAt).toLocaleTimeString()}
          </span>
          {message.isRead && isOwn && (
            <span className="text-xs opacity-70">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};
// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';
// import { formatRelativeTime, formatMessageTime } from '../../utils/timeUtils';
// import { cn } from '../../utils/styles';
// import type { ChatMessage, UserProfile } from '../../types/chat';
// import { useAuth } from '../../hooks/useAuth';

// interface MessageProps {
//   message: ChatMessage;
//   currentUser?: UserProfile | null;
//   onEdit?: (messageId: number, content: string) => Promise<void>;
//   onDelete?: (messageId: number) => Promise<void>;
// }

// export const MessageComponent = ({ 
//   message, 
//   currentUser, 
//   onEdit, 
//   onDelete 
// }: MessageProps) => {
//   const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(message.content);
//   const [showActions, setShowActions] = useState(false);
//   const isOwnMessage = message.sender.id === user?.userId;

//   const handleEdit = async () => {
//     if (!onEdit || editContent.trim() === message.content) {
//       setIsEditing(false);
//       return;
//     }

//     try {
//       await onEdit(message.id, editContent.trim());
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Failed to edit message:', error);
//       setEditContent(message.content);
//     }
//   };

//   const handleDelete = async () => {
//     if (!onDelete) return;

//     try {
//       await onDelete(message.id);
//     } catch (error) {
//       console.error('Failed to delete message:', error);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={cn(
//         "group flex gap-3 relative",
//         isOwnMessage ? "flex-row-reverse" : "flex-row"
//       )}
//       onMouseEnter={() => setShowActions(true)}
//       onMouseLeave={() => setShowActions(false)}
//     >
//       {/* Avatar */}
//       {!isOwnMessage && (
//         <img
//           src={message.sender.avatar || '/default-avatar.png'}
//           alt={message.sender.username}
//           className="w-8 h-8 rounded-full mt-1"
//         />
//       )}

//       {/* Message Content */}
//       <div
//         className={cn(
//           "max-w-[70%] rounded-xl",
//           isOwnMessage
//             ? "bg-indigo-500 text-white"
//             : "bg-stone-800 text-white"
//         )}
//       >
//         {/* Sender name for group chats */}
//         {!isOwnMessage && (
//           <span className="text-xs text-gray-400 ml-3 mt-1 block">
//             {message.sender.username}
//           </span>
//         )}

//         {/* Message content/edit form */}
//         {isEditing ? (
//           <div className="p-2">
//             <textarea
//               value={editContent}
//               onChange={(e) => setEditContent(e.target.value)}
//               className="w-full bg-stone-700 text-white rounded p-2 resize-none"
//               rows={2}
//               autoFocus
//             />
//             <div className="flex justify-end gap-2 mt-2">
//               <button
//                 onClick={() => {
//                   setIsEditing(false);
//                   setEditContent(message.content);
//                 }}
//                 className="p-1 text-gray-400 hover:text-white"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={handleEdit}
//                 className="p-1 text-green-400 hover:text-green-300"
//               >
//                 <Check className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="p-3">
//             <p className="whitespace-pre-wrap break-words">{message.content}</p>
//             <div className="flex items-center gap-2 mt-1">
//               <span className="text-xs opacity-70">
//                 {formatMessageTime(message.sentAt)}
//               </span>
//               {message.isEdited && (
//                 <span className="text-xs opacity-50">(edited)</span>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Message Actions */}
//       {isOwnMessage && showActions && !isEditing && (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className={cn(
//             "absolute top-0 bg-stone-800 rounded-lg shadow-lg",
//             isOwnMessage ? "left-0" : "right-0",
//             "flex items-center gap-1 p-1"
//           )}
//         >
//           {onEdit && (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="p-1 text-gray-400 hover:text-white rounded"
//               title="Edit message"
//             >
//               <Edit2 className="w-4 h-4" />
//             </button>
//           )}
//           {onDelete && (
//             <button
//               onClick={handleDelete}
//               className="p-1 text-gray-400 hover:text-red-400 rounded"
//               title="Delete message"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           )}
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// // System Message Component
// export const SystemMessage = ({ content }: { content: string }) => {
//   return (
//     <div className="flex justify-center my-4">
//       <span className="px-3 py-1 bg-stone-800 rounded-full text-xs text-gray-400">
//         {content}
//       </span>
//     </div>
//   );
// };

// // Message Date Separator
// export const DateSeparator = ({ date }: { date: string }) => {
//   return (
//     <div className="flex items-center gap-4 my-6">
//       <div className="flex-1 h-px bg-stone-800" />
//       <span className="text-xs text-gray-400">{date}</span>
//       <div className="flex-1 h-px bg-stone-800" />
//     </div>
//   );
// };

// export default MessageComponent;
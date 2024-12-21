// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import { cn } from '../../utils/styles';

// interface TypingIndicatorProps {
//   username: string;
// }

// export function TypingIndicator({ username }: TypingIndicatorProps) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -10 }}
//       className="text-sm text-gray-400 flex items-center gap-2"
//     >
//       <span>{username} is typing</span>
//       <motion.div className="flex gap-1">
//         {[1, 2, 3].map((dot) => (
//           <motion.span
//             key={dot}
//             className="w-1 h-1 bg-gray-400 rounded-full"
//             animate={{
//               scale: [1, 1.2, 1],
//               opacity: [1, 0.5, 1]
//             }}
//             transition={{
//               duration: 1,
//               repeat: Infinity,
//               delay: dot * 0.2
//             }}
//           />
//         ))}
//       </motion.div>
//     </motion.div>
//   );
// }

// interface OnlineStatusProps {
//   userId: number;
//   lastActive: Date;
//   size?: 'sm' | 'md' | 'lg';
// }

// export function OnlineStatus({ userId, lastActive, size = 'md' }: OnlineStatusProps) {
//   const [isOnline, setIsOnline] = useState(false);
//   const [lastActiveString, setLastActiveString] = useState('');

//   useEffect(() => {
//     // Check if user was active in last 5 minutes
//     const wasRecentlyActive = 
//       new Date().getTime() - new Date(lastActive).getTime() < 5 * 60 * 1000;
//     setIsOnline(wasRecentlyActive);

//     // Format last active time
//     const formatLastActive = () => {
//       const now = new Date();
//       const lastActiveDate = new Date(lastActive);
//       const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / 60000);

//       if (diffMinutes < 1) return 'Just now';
//       if (diffMinutes < 60) return `${diffMinutes}m ago`;
//       if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
//       return lastActiveDate.toLocaleDateString();
//     };

//     setLastActiveString(formatLastActive());
//   }, [lastActive]);

//   const sizeClasses = {
//     sm: 'w-2 h-2',
//     md: 'w-3 h-3',
//     lg: 'w-4 h-4'
//   };

//   return (
//     <div className="relative inline-flex items-center">
//       <div
//         className={cn(
//           "rounded-full border-2 border-stone-900",
//           sizeClasses[size],
//           isOnline ? "bg-green-500" : "bg-gray-500"
//         )}
//       />
//       <span className="sr-only">
//         {isOnline ? 'Online' : `Last active ${lastActiveString}`}
//       </span>
//     </div>
//   );
// }

// interface UserPresenceProps {
//   users: Array<{ id: number; username: string; lastActive: Date }>;
// }

// export function UserPresence({ users }: UserPresenceProps) {
//   return (
//     <div className="flex flex-wrap gap-2">
//       {users.map(user => (
//         <div
//           key={user.id}
//           className="flex items-center gap-2 px-3 py-1 bg-stone-800 rounded-full"
//         >
//           <OnlineStatus userId={user.id} lastActive={user.lastActive} size="sm" />
//           <span className="text-sm text-gray-400">{user.username}</span>
//         </div>
//       ))}
//     </div>
//   );
// }
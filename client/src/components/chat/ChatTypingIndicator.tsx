// import { motion } from "framer-motion";

// interface TypingIndicatorProps {
//     username: string;
//   }
  
//   export function ChatTypingIndicator({ username }: TypingIndicatorProps) {
//     return (
//       <div className="flex items-center gap-2 text-sm text-gray-400">
//         <div className="flex items-center gap-1">
//           <motion.span
//             animate={{ opacity: [0, 1, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity }}
//             className="w-1 h-1 bg-gray-400 rounded-full"
//           />
//           <motion.span
//             animate={{ opacity: [0, 1, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
//             className="w-1 h-1 bg-gray-400 rounded-full"
//           />
//           <motion.span
//             animate={{ opacity: [0, 1, 0] }}
//             transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
//             className="w-1 h-1 bg-gray-400 rounded-full"
//           />
//         </div>
//         <span>{username} is typing...</span>
//       </div>
//     );
//   }
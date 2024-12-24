// import { useState } from "react";
// import { useNotifications } from "../hooks/useNotifications";
// import { Bell } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";

// export const NotificationIndicator = () => {
//     const { notifications, unreadCount, markAllAsRead } = useNotifications();
//     const [isOpen, setIsOpen] = useState(false);
  
//     return (
//       <div className="relative">
//         {/* Notification Bell */}
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
//         >
//           <Bell className="w-6 h-6" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
//               <span className="text-xs font-medium text-white">
//                 {unreadCount}
//               </span>
//             </span>
//           )}
//         </button>
  
//         {/* Notification Panel */}
//         <AnimatePresence>
//           {isOpen && (
//             <>
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 10 }}
//                 className="absolute right-0 mt-2 w-80 bg-stone-900 rounded-lg shadow-lg border border-stone-800 overflow-hidden"
//               >
//                 {/* Header */}
//                 <div className="p-4 border-b border-stone-800 flex justify-between items-center">
//                   <h3 className="font-medium text-white">Notifications</h3>
//                   {unreadCount > 0 && (
//                     <button
//                       onClick={markAllAsRead}
//                       className="text-sm text-indigo-400 hover:text-indigo-300"
//                     >
//                       Mark all as read
//                     </button>
//                   )}
//                 </div>
  
//                 {/* Notification List */}
//                 <div className="max-h-[400px] overflow-y-auto">
//                   {notifications.length > 0 ? (
//                     notifications.map((notification) => (
//                       <NotificationItem
//                         key={notification.id}
//                         notification={notification}
//                       />
//                     ))
//                   ) : (
//                     <div className="p-8 text-center text-gray-400">
//                       <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                       <p>No notifications</p>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
  
//               {/* Backdrop */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 z-40"
//                 onClick={() => setIsOpen(false)}
//               />
//             </>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   };
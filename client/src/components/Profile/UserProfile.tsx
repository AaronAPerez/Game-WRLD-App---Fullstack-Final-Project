// import React from 'react';
// import { User } from '../../types';
// import { useQuery, useMutation } from '@tanstack/react-query';
// import { userService } from '../../services/api';

// interface UserProfileProps {
//   userId: string;
// }

// export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
//   const { data: user } = useQuery(['user', userId], () => 
//     userService.getUser(userId)
//   );

//   const updateMutation = useMutation(
//     (data: Partial<User>) => userService.updateUser(userId, data)
//   );

//   if (!user) return null;

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <div className="flex items-center space-x-6">
//         <img
//           src={user.profilePicture || '/default-avatar.png'}
//           alt={`${user.firstName} ${user.lastName}`}
//           className="w-24 h-24 rounded-full"
//         />
//         <div>
//           <h2 className="text-2xl font-bold">
//             {user.firstName} {user.lastName}
//           </h2>
//           <p className="text-gray-600">{user.bio}</p>
//           <p className="text-sm text-gray-500">
//             Joined {new Date(user.joinDate).toLocaleDateString()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
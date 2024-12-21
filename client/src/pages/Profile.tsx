import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Users, 
  Gamepad2, 
  Calendar,
  Edit2,
  Camera,
  X,
  Check,
  Clock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../api/user';
import { Button } from '../components/common/Button';
import { toast } from 'react-hot-toast';
import { cn } from '../utils/styles';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    avatar: null as File | null
  });

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => userId ? userService.getUserProfile(parseInt(userId)) : userService.getProfile(),
    initialData: userId ? undefined : currentUser
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username?: string; avatar?: File }) => {
      const formData = new FormData();
      if (data.username) formData.append('username', data.username);
      if (data.avatar) formData.append('avatar', data.avatar);
      return userService.updateProfile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-medium text-white mb-2">User not found</h2>
        <p className="text-gray-400">The requested profile could not be found</p>
      </div>
    );
  }

  const isOwnProfile = !userId || parseInt(userId) === currentUser?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Profile Header */}
      <div className="relative mb-8">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl" />
        
        {/* Profile Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 px-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt={profile.username}
              className="w-32 h-32 rounded-xl border-4 border-stone-900 bg-stone-800"
            />
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl cursor-pointer group">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditForm(prev => ({ ...prev, avatar: file }));
                    }
                  }}
                />
              </label>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      username: e.target.value 
                    }))}
                    className="bg-stone-800 text-white px-4 py-2 rounded-lg"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-white">
                    {profile.username}
                  </h1>
                )}
                <div className="flex items-center gap-4 mt-2 text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                  </div>
                  {profile.isOnline && (
                    <span className="text-green-400">Online</span>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          updateProfileMutation.mutate({
                            username: editForm.username,
                            avatar: editForm.avatar
                          });
                        }}
                        isLoading={updateProfileMutation.isPending}
                      >
                        <Check className="w-5 h-5" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditForm({
                          username: profile.username,
                          avatar: null
                        });
                        setIsEditing(true);
                      }}
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-medium">Friends</h3>
          </div>
          <p className="text-3xl font-bold">{profile.friendsCount}</p>
        </div>

        <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-medium">Games</h3>
          </div>
          <p className="text-3xl font-bold">{profile.gamesCount}</p>
        </div>

        <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-medium">Member Since</h3>
          </div>
          <p className="text-xl">
            {new Date(profile.createdAt).toLocaleDateString(undefined, { 
              year: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Activity</h2>
        <div className="bg-stone-900 rounded-xl border border-stone-800">
          <div className="p-4 border-b border-stone-800">
            <h3 className="font-medium">Activity Feed</h3>
          </div>
          <div className="divide-y divide-stone-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-400">
                    Started playing <span className="text-white">Game Name</span>
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, MessageSquare, Users, Settings, X, Check } from 'lucide-react';
import { userService } from '../api/user';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import { Button } from '../components/common/Button';
import { cn } from '../utils/styles';
import type { UserProfileDTO } from '../types';

// User Profile Component
export const UserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { username?: string; avatar?: File }) => {
      const formData = new FormData();
      if (data.username) formData.append('username', data.username);
      if (data.avatar) formData.append('avatar', data.avatar);
      return userService.updateProfile(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile']);
      setIsEditing(false);
    }
  });

  const handleUpdateProfile = async () => {
    await updateProfileMutation.mutateAsync({
      username: newUsername !== user?.username ? newUsername : undefined,
      avatar: avatarFile
    });
  };

  return (
    <div className="space-y-6 p-6 bg-stone-900 rounded-xl border border-stone-800">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <Button
          variant="ghost"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={user?.avatar || '/default-avatar.png'}
            alt={user?.username}
            className="w-24 h-24 rounded-full object-cover"
          />
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
              <span className="text-sm text-white">Change</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-stone-800 text-white px-4 py-2 rounded-lg"
            />
          ) : (
            <h3 className="text-xl font-medium text-white">
              {user?.username}
            </h3>
          )}
          <p className="text-sm text-gray-400 mt-1">
            Joined {new Date(user?.createdAt || '').toLocaleDateString()}
          </p>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateProfile}
            isLoading={updateProfileMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
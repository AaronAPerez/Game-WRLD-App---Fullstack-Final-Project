import { useState } from 'react';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { 
  LogOut, 
  Settings, 
  User,
  MessageSquare,
  Users,
  LayoutDashboard,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';


// Update LoginResponse type
interface LoginResponse {
  token: string;
  userId: number;
  publisherName: string;
  avatar?: string;
}

// Update mutation type
interface AvatarMutationResult {
  success: boolean;
  avatarUrl: string;
}



const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const AvatarMenu = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  // Upload mutation
  const { mutate: uploadAvatar, isPending: isLoading } = useMutation<
    AvatarMutationResult,
    Error,
    File
  >({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return UserService.updateAvatar(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success('Avatar updated successfully');
    },
    onError: () => {
      toast.error('Failed to update avatar');
    }
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Upload file
    uploadAvatar(file);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-500 hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-stone-950"
        >
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <img
              src={user?.avatar || '/default-avatar.svg'}
              alt={`${user?.publisherName}'s avatar`}
              className="w-full h-full object-cover"
            />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-stone-900 rounded-lg shadow-lg py-1 z-50 border border-stone-800">
          <div className="px-4 py-3 border-b border-stone-800">
            <p className="text-sm text-white font-medium">{user?.publisherName}</p>
            <label className="mt-2 flex items-center gap-2 text-xs text-indigo-400 cursor-pointer hover:text-indigo-300">
              <User className="w-4 h-4" />
              <span>Change Avatar</span>
              <input
                type="file"
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>

          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-stone-800 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-800">
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-stone-800 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
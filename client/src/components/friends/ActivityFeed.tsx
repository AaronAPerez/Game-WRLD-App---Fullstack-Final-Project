import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Gamepad, 
  Trophy, 
  UserPlus, 
  Star,
  MessageSquare,
  BookOpen,
  Loader2 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils/styles';
import { Activity, ActivityType } from '../../types/activity';
import { useChat } from '../../hooks/useChat';

// Activity service (add to your services)
const activityService = {
  getFriendActivities: async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/activities?page=${pageParam}`);
    return response.json();
  }
};

const ACTIVITY_ICONS: Record<ActivityType, typeof Gamepad> = {
  GAME_STARTED: Gamepad,
  GAME_ACHIEVEMENT: Trophy,
  FRIEND_ADDED: UserPlus,
  STATUS_CHANGED: UserPlus,
  BLOG_POSTED: BookOpen,
  GAME_RATED: Star,
  GAME_REVIEWED: MessageSquare
};

export function ActivityFeed() {
  const { connection } = useChat();
  const { ref: loadMoreRef, inView } = useInView();
  const lastActivityRef = useRef<string>();

  // Fetch activities with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['friendActivities'],
    queryFn: activityService.getFriendActivities,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    getPreviousPageParam: (firstPage) => firstPage.previousPage
  });

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Setup real-time activity updates
  useEffect(() => {
    if (!connection) return;

    connection.on('NewFriendActivity', (activity: Activity) => {
      // Only add if it's newer than our last activity
      if (!lastActivityRef.current || 
          new Date(activity.createdAt) > new Date(lastActivityRef.current)) {
        // Update react-query cache
        queryClient.setQueryData(['friendActivities'], (oldData: any) => {
          const newData = { ...oldData };
          newData.pages[0].activities = [activity, ...newData.pages[0].activities];
          return newData;
        });
        lastActivityRef.current = activity.createdAt;
      }
    });

    return () => {
      connection.off('NewFriendActivity');
    };
  }, [connection]);

  // Generate activity content based on type
  const getActivityContent = (activity: Activity) => {
    const { user, type, data } = activity;
    
    switch (type) {
      case 'GAME_STARTED':
        return (
          <div className="flex items-center gap-3">
            <img
              src={data.gameImage || '/default-game.png'}
              alt={data.gameName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <span className="font-medium text-white">{user.username}</span>
              <span className="text-gray-400"> started playing </span>
              <span className="font-medium text-white">{data.gameName}</span>
            </div>
          </div>
        );

      case 'GAME_ACHIEVEMENT':
        return (
          <div className="flex items-center gap-3">
            <img
              src={data.achievementImage || '/default-achievement.png'}
              alt={data.achievementName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <span className="font-medium text-white">{user.username}</span>
              <span className="text-gray-400"> earned achievement </span>
              <span className="font-medium text-white">{data.achievementName}</span>
            </div>
          </div>
        );

      case 'FRIEND_ADDED':
        return (
          <div className="flex items-center gap-3">
            <img
              src={data.friendAvatar || '/default-avatar.png'}
              alt={data.friendName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <span className="font-medium text-white">{user.username}</span>
              <span className="text-gray-400"> became friends with </span>
              <span className="font-medium text-white">{data.friendName}</span>
            </div>
          </div>
        );

      // other activity 
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {data?.pages.map((page, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {page.activities.map((activity: Activity) => {
              const Icon = ACTIVITY_ICONS[activity.type];
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 bg-stone-900 rounded-xl",
                    "border border-stone-800",
                    "hover:border-indigo-500/30 transition-all duration-300"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-2 rounded-xl",
                      "bg-indigo-500/20 text-indigo-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      {getActivityContent(activity)}
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDistanceToNow(new Date(activity.createdAt), { 
                          addSuffix: true 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-4">
        {isFetchingNextPage && (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        )}
      </div>
    </div>
  );
}
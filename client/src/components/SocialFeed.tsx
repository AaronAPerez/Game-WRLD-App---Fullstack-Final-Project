import { usePosts } from "../hooks/usePosts";
import { CreatePost } from "./CreatePost";
import { PostCard } from "./PostCard";

export const SocialFeed = () => {
    const { posts, isLoading } = usePosts();
    
    if (isLoading) return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  
    return (
      <div className="max-w-2xl mx-auto py-8">
        <CreatePost />
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  };
  
  export default SocialFeed;
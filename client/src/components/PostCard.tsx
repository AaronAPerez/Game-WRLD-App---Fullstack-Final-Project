import { MessageCircle, MoreVertical, Share2, ThumbsUpIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import React from "react";

export const PostCard = ({ post }: { post: PostType }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = React.useState(false);
    const [showComments, setShowComments] = React.useState(false);
  
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
        {/* Post Header */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
              {post.publisherName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white">{post.publisherName}</h3>
              <p className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
  
        {/* Post Content */}
        <div className="px-4 py-2">
          <p className="text-white">{post.description}</p>
        </div>
  
        {/* Post Image */}
        {post.image && (
          <div className="mt-2">
            <img src={post.image} alt="Post content" className="w-full" />
          </div>
        )}
  
        {/* Post Actions */}
        <div className="p-4 flex items-center gap-6 border-t border-gray-700">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <ThumbsUpIcon className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes || 0}</span>
          </button>
  
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments?.length || 0}</span>
          </button>
  
          <button className="flex items-center gap-2 text-gray-400 hover:text-white">
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>
  
        {/* Comments Section */}
        {showComments && post.comments && (
          <div className="p-4 border-t border-gray-700">
            {post.comments.map((comment) => (
              <div key={comment.id} className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-white">{comment.username}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-200">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
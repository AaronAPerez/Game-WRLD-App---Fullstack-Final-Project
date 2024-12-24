import { useState } from 'react';
import { useBlogPosts, useCreateBlogPost } from '../hooks/useBlog';
import { BlogList } from '../components/blog/BlogList';
import { useAuth } from '../hooks/useAuth';
import BlogEditor from '../components/blog/BlogEditor';



export default function BlogPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 9,
    category: 'all'
  });
  
  const { user } = useAuth();
  const { data, isLoading } = useBlogPosts(filters);
  const createMutation = useCreateBlogPost();

  const handleCreatePost = async (data) => {
    await createMutation.mutateAsync({
      ...data,
      userId: user?.userId,
      publisherName: user?.publisherName
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <BlogEditor onSubmit={handleCreatePost} />
      </div>

      {/* <BlogFilters
        activeCategory={filters.category}
        onCategoryChange={(category) => setFilters(prev => ({
          ...prev,
          category,
          page: 1
        }))}
      /> */}

      <BlogList
        posts={data?.data || []}
        isLoading={isLoading}
        onPageChange={(page) => setFilters(prev => ({
          ...prev,
          page
        }))}
        pagination={{
          currentPage: filters.page,
          totalPages: data?.totalPages || 1
        }}
      />
    </div>
  );
}




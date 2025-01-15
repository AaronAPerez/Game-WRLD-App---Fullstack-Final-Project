export const BLOG_KEYS = {
    list: () => ['blogs'],
    detail: (id: number) => ['blogs', id],
    userPosts: (userId: number) => ['blogs', 'user', userId],
    byCategory: (category: string) => ['blogs', 'category', category]
  } as const;
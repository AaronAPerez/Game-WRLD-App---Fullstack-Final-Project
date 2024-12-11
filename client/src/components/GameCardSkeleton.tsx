// Loading Skeleton Component
export const GameCardSkeleton = () => (
  <div className="bg-stone-900 rounded-lg overflow-hidden">
    <div className="aspect-video bg-stone-800 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-stone-800 rounded animate-pulse" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-stone-800 rounded animate-pulse" />
        <div className="h-6 w-20 bg-stone-800 rounded animate-pulse" />
      </div>
    </div>
  </div>
);
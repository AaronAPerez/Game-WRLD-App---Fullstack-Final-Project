import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';


interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  loadingIndicator?: React.ReactNode;
  className?: string;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  fetchMore,
  hasMore,
  isLoading,
  threshold = 0.8,
  loadingIndicator,
  className
}: InfiniteScrollProps<T>) {
  const observerRef = useRef<IntersectionObserver>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        fetchMore();
      }
    },
    [fetchMore, hasMore, isLoading]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold
    };

    observerRef.current = new IntersectionObserver(handleObserver, option);

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className={className}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
      
      <div ref={containerRef} className="h-4" />
      
      {isLoading && (
        <div className="flex justify-center p-4">
          {loadingIndicator || (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InfiniteScroll;
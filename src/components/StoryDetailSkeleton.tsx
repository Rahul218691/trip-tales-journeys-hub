import { Skeleton } from "@/components/ui/skeleton";

const StoryDetailSkeleton = () => {
  return (
    <div className="container py-8">
      {/* Story header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-3/4 mb-4 bg-muted-foreground/20" />
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-muted-foreground/20" />
            <Skeleton className="h-3 w-24 bg-muted-foreground/20" />
          </div>
        </div>
        <Skeleton className="h-4 w-1/2 mb-2 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-1/3 bg-muted-foreground/20" />
      </div>

      {/* Cover image skeleton */}
      <div className="mb-8">
        <Skeleton className="w-full aspect-[16/9] rounded-lg bg-muted-foreground/20" />
      </div>

      {/* Story content skeleton */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-3/4 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-5/6 bg-muted-foreground/20" />
      </div>

      {/* Story images skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square rounded-lg bg-muted-foreground/20" />
        ))}
      </div>

      {/* Comments section skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-32 mb-4 bg-muted-foreground/20" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full bg-muted-foreground/20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 bg-muted-foreground/20" />
              <Skeleton className="h-4 w-full bg-muted-foreground/20" />
              <Skeleton className="h-4 w-3/4 bg-muted-foreground/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryDetailSkeleton; 
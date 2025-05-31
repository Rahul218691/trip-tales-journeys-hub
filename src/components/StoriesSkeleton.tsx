const skeletonArray = Array.from({ length: 6 });

const StoriesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {skeletonArray.map((_, idx) => (
      <div key={idx} className="overflow-hidden rounded-xl bg-muted animate-pulse shadow">
        <div className="aspect-[4/3] bg-muted-foreground/10" />
        <div className="p-4 space-y-2">
          <div className="h-5 w-2/3 bg-muted-foreground/20 rounded" />
          <div className="h-4 w-1/3 bg-muted-foreground/10 rounded" />
        </div>
        <div className="flex justify-between items-center px-4 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-muted-foreground/20" />
            <div className="h-4 w-16 bg-muted-foreground/10 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-8 bg-muted-foreground/10 rounded" />
            <div className="h-4 w-6 bg-muted-foreground/10 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default StoriesSkeleton; 
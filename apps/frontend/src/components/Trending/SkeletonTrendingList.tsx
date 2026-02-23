const SkeletonTrendingList = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="h-78 animate-pulse skeleton-color" />
      <div className="h-16.5 animate-pulse skeleton-color rounded-md" />
      <div className="h-16.5 animate-pulse skeleton-color rounded-md" />
      <div className="h-16.5 animate-pulse skeleton-color rounded-md" />
      <div className="h-16.5 animate-pulse skeleton-color rounded-md" />
      <div className="h-16.5 animate-pulse skeleton-color rounded-md" />
      <div className="h-16.5 animate-pulse skeleton-color rounded-md" />
    </div>
  );
};

export default SkeletonTrendingList;

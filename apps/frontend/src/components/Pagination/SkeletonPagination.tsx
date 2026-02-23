const SkeletonPagination = () => {
  return (
    <div className="flex-center gap-1">
      <div className="w-10 h-10 animate-pulse skeleton-color rounded-xl" />
      <div className="w-10 h-10 animate-pulse skeleton-color rounded-xl" />
      <div className="w-10 h-10 animate-pulse skeleton-color rounded-xl" />
      <div className="w-10 h-10 animate-pulse skeleton-color rounded-xl" />
      <div className="w-10 h-10 animate-pulse skeleton-color rounded-xl" />
    </div>
  );
};

export default SkeletonPagination;

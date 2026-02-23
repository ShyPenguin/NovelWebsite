const SkeletonNavbarReading = () => {
  return (
    <div className="flex container justify-between items-center px-4 py-3">
      <div className="w-[50px] h-[40px] animate-pulse skeleton-color rounded-xl" />
      <div className="w-[50px] h-[40px] animate-pulse skeleton-color rounded-xl" />
      <div className="w-[80px] h-[40px] animate-pulse skeleton-color rounded-xl" />
    </div>
  );
};

export default SkeletonNavbarReading;

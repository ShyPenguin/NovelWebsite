import SkeletonPagination from "../../../shared/components/Pagination/SkeletonPagination";

const SkeletonChapterList = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <div className="flex flex-col animate-pulse skeleton-color h-21 rounded-md" />
      <SkeletonPagination />
    </div>
  );
};

export default SkeletonChapterList;

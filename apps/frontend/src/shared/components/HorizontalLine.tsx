const HorizontalLine = ({ className }: { className?: string }) => {
  return (
    <div
      data-orientation="horizontal"
      role="none"
      className={`shrink-0 bg-border dark:bg-secondary-black h-px w-full ${className}`}
    />
  );
};

export default HorizontalLine;

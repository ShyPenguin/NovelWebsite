export const Spinner = ({
  className = "",
  borderColor = "border-current",
}: {
  className?: string;
  borderColor?: string;
}) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid ${borderColor} ${className} border-r-transparent `}
    />
  );
};

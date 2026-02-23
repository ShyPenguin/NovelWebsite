type PencilProps = {
  className?: string;
  pathClassName?: string;
};

const Pencil = ({ className, pathClassName }: PencilProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 16"
    className={className}
  >
    <g fill="currentColor" className={pathClassName}>
      <path d="m13 0 3 3-7 7H6V7l7-7Z" />
      <path d="M1 1v14h14V9h-2v4H3V3h4V1H1Z" />
    </g>
  </svg>
);
export default Pencil;

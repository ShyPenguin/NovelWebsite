const Check = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 24 24" // Add this line
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    aria-hidden="true"
    {...props}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
export default Check;

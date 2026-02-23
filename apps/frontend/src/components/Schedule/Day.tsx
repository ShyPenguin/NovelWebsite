export const Day = ({
  on,
  day,
  onClick,
}: {
  on: boolean;
  day: string;
  onClick?: ({ day, on }: { day: string; on: boolean }) => void;
}) => {
  return (
    <li>
      <button
        type="button"
        className="rounded-xl h-10 px-3 items-center justify-center data-[state=on]:bg-[#99BC85] data-[state=off]:bg-novelRed text-primary-black dark:text-white font-semibold"
        data-state={on ? "on" : "off"}
        onClick={() => {
          onClick && onClick({ day, on: !on });
        }}
      >
        {day.charAt(0)}
      </button>
    </li>
  );
};

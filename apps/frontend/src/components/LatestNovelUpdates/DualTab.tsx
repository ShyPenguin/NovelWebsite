import type { Dispatch } from "react";

export const DualTab = ({
  firstTab,
  setFirstTab,
  firstTabName,
  secondTabName,
}: {
  firstTab: boolean;
  setFirstTab: Dispatch<React.SetStateAction<boolean>>;
  firstTabName: string;
  secondTabName: string;
}) => {
  return (
    <div className="dual-tab">
      <button
        data-active={firstTab ? "false" : "true"}
        onClick={() => setFirstTab(() => false)}
        disabled={firstTab == false}
      >
        {firstTabName}
      </button>
      <button
        data-active={firstTab ? "true" : "false"}
        onClick={() => setFirstTab(() => true)}
        disabled={firstTab == true}
      >
        {secondTabName}
      </button>
    </div>
  );
};

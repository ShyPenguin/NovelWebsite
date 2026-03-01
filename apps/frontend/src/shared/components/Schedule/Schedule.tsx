import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { Day } from "./Day";
import { week } from "@repo/contracts/fields/novel";

export const Schedule = ({
  schedule,
  onChange,
}: {
  schedule: NovelDetailDTO["schedule"];
  onChange?: ({ on, day }: { on: boolean; day: string }) => void;
}) => {
  return (
    <ul className="flex gap-1">
      {week.map((day, index) => {
        const on = schedule.includes(day);
        return <Day on={on} day={day} key={index} onClick={onChange} />;
      })}
    </ul>
  );
};

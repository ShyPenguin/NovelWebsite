import type { DropdownOption, DropdownProps } from "../../types";
import { DropdownBase } from "./DropdownBase";

const DropdownSelect = <T extends DropdownOption>({
  options,
  selectedOption,
  label,
  onChange,
  className,
  errorMessage,
}: Pick<
  DropdownProps<T>,
  | "options"
  | "selectedOption"
  | "label"
  | "onChange"
  | "className"
  | "errorMessage"
>) => {
  return (
    <DropdownBase
      options={options}
      selectedOption={selectedOption}
      label={label}
      onChange={onChange}
      buttonLabelNode={<p>{selectedOption.label}</p>}
      className={className}
      errorMessage={errorMessage}
    />
  );
};

export default DropdownSelect;

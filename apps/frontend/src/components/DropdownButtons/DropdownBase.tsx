import { useRef, useState } from "react";
import { Check, Chevron } from "../../assets/icons/Index";
import type { DropdownOption, DropdownProps } from "../../types";
import useClickInsideOrOutside from "../../hooks/useClickInsideOrOutside";

export const DropdownBase = <T extends DropdownOption>({
  options,
  selectedOption,
  label,
  onChange,
  className,
  buttonLabelNode,
  infinite = false,
  fetchingNode,
  lastItemRef,
  errorMessage,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickInsideOrOutside("OUTSIDE", dropdownRef, () => {
    setIsOpen(false);
  });
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex h-10 w-full max-w-50 items-center justify-between py-5 px-3 bg-transparent dark:bg-transparent rounded-xl border \
           focus:ring-1 focus:ring-black focus:dark:ring-white cursor-pointer ${className} ${
             errorMessage
               ? "border-red-500 dark:border-red-500"
               : "border-border dark:border-secondary-black"
           }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {buttonLabelNode}
        <Chevron
          className="w-3 h-3 text-dark-muted-foreground opacity-50"
          initialRotation="rotate-0"
          isOpenRotation="rotate-180"
          isOpen={isOpen}
        />
      </button>
      {isOpen && (
        <ul
          className={`z-100 absolute top-11 flex flex-col w-full max-h-50.5 overflow-y-auto py-2 px-1 items-center text-left text-base bg-white dark:bg-primary-black rounded-xl border border-border dark:border-secondary-black`}
        >
          {label && (
            <label className="font-semibold w-full flex px-2">
              <div className="w-4 h-4 flex justify-items-center mr-1 lg:mr-4" />
              <p>{label}</p>
            </label>
          )}

          {selectedOption.value && (
            <li
              key={selectedOption.value}
              className="drop-down-list"
              role="selected-option"
              aria-selected={true}
            >
              <div className="w-4 h-4 flex justify-items-center mr-1 lg:mr-4">
                <Check className="w-4 h-4" />
              </div>
              <div className="wrap-break-word whitespace-normal h-full min-w-4">
                {selectedOption.label}
              </div>
            </li>
          )}

          {options.map((option, i) => {
            const isLast = i === options.length - 1;
            if (option.value === selectedOption.value) return;
            return (
              <li
                key={option.value}
                className="drop-down-list"
                ref={isLast && infinite ? lastItemRef : undefined}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={false}
              >
                <div className="w-4 h-4 flex justify-items-center mr-1 lg:mr-4"></div>
                <div className="wrap-break-word whitespace-normal h-full min-w-4">
                  {option.label}
                </div>
              </li>
            );
          })}
          {infinite && fetchingNode}
        </ul>
      )}
    </div>
  );
};

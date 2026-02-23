import type { ReactNode } from "react";

export type DropdownOption = {
  value: string;
  label: string;
};

export type DropdownProps<T extends DropdownOption> = {
  options: T[];
  selectedOption: T;
  onChange: (option: T) => void;
  buttonLabelNode: ReactNode;
  label?: string;
  className?: string;
  // Form
  errorMessage?: string;
  // Infinite scroll
  infinite?: boolean;
  fetchingNode?: ReactNode;
  lastItemRef?: (node: HTMLLIElement | null) => void;
} & (
  | {
      infinite?: false;
      fetchingNode?: never;
      lastItemRef?: never;
    }
  | {
      infinite: true;
      fetchingNode: ReactNode;
      lastItemRef: (node: HTMLLIElement | null) => void;
    }
);

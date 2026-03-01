import { Spinner } from "../Spinner";

type ButtonProps =
  | {
      type: "button";
      isPending: boolean;
      handleButton: () => void;
      className?: string;
      label: string;
      isPendingLabel: string;
    }
  | {
      type: "submit";
      isPending: boolean;
      className?: string;
      label: string;
      isPendingLabel: string;
      handleButton?: never; // Explicitly disallow
    };

export const FormButton = (props: ButtonProps) => {
  const { type, isPending, className, label, isPendingLabel } = props;

  return (
    <button
      type={type}
      className={`form-button ${className}`}
      onClick={type === "button" ? props.handleButton : undefined}
    >
      {isPending ? isPendingLabel : label}
      {isPending && (
        <span>
          <Spinner className="w-3 h-3" />
        </span>
      )}
    </button>
  );
};

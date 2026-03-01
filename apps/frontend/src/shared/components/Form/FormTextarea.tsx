import type { Path, UseFormRegister, RegisterOptions } from "react-hook-form";

type TextAreaProps<T extends Record<string, any>> = {
  label: string;
  name: Path<T>; // Path ensures type-safe field names
  placeholder?: string;
  errorMessage?: string;
  register: UseFormRegister<T>;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  options?: RegisterOptions<T>; // Add this line
  rows?: number;
};

export const FormTextArea = <T extends Record<string, any>>({
  label,
  name,
  placeholder = "",
  errorMessage,
  register,
  className,
  disabled,
  required,
  options,
  labelClassName,
  rows = 6,
}: TextAreaProps<T>) => {
  return (
    <div className="size-full flex flex-col gap-2">
      <label className={`text-sm font-medium text-inherit ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        rows={rows}
        {...register(name, options)}
        disabled={disabled}
        className={`size-full p-2 border border-border dark:border-secondary-black rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
          errorMessage ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

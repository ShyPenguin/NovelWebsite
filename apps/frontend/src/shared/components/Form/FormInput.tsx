import type { Path, UseFormRegister, RegisterOptions } from "react-hook-form";

type InputProps<T extends Record<string, any>> = {
  label: string;
  name: Path<T>; // Path ensures type-safe field names
  type: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
  placeholder?: string;
  errorMessage?: string;
  register: UseFormRegister<T>;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  options?: RegisterOptions<T>; // Add this line
};

export const FormInput = <T extends Record<string, any>>({
  label,
  name,
  type,
  placeholder = "",
  errorMessage,
  register,
  className,
  disabled,
  required,
  options,
  labelClassName,
}: InputProps<T>) => {
  return (
    <div className="size-full flex flex-col gap-2">
      <label className={`form-label ${labelClassName}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
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

import { Spinner } from "./Spinner";

export const LoadingSpinner = ({ text = "Loading" }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Spinner className="w-6 h-6 md:w-8 md:h-8" />
      <div className="text-center mt-5">
        <p className="text-lg font-medium">{text}</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
};

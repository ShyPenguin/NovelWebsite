import { useEffect } from "react";
import ButtonIcon from "../ButtonIcon";
import { CameraIcon } from "@/assets/icons/CameraIcon";

type ImageInputProps = {
  value?: File;
  onChange: (file?: File) => void;
  defaultImageUrl: string;
  shape: "circle" | "square";
  width: string;
  height: string;
  errorMessage?: string;
  className?: string;
};

export function FormImageInput({
  value,
  onChange,
  shape,
  width,
  height,
  defaultImageUrl,
  errorMessage,
  className,
}: ImageInputProps) {
  const previewUrl = value ? URL.createObjectURL(value) : defaultImageUrl;

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  return (
    <div className="flex flex-col items-center relative">
      <div
        className={`absolute ${shape == "square" ? "-top-1.25 -left-1.25" : "top-3 left-3"}`}
      >
        <div className="relative">
          <label className="absolute w-8 h-8" htmlFor="image-input">
            <ButtonIcon>
              <CameraIcon className="w-full h-full" />
            </ButtonIcon>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              onChange(file);
            }}
            className="absolute w-8 h-8 opacity-0 cursor-pointer -z-10"
            id="image-input"
          />
        </div>
      </div>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Image preview"
          className={`${width} ${height} object-cover ${shape == "square" ? "rounded-xl" : "rounded-full"} ${className}
            ${errorMessage && "border border-red-500"} card`}
        />
      )}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

import { useEffect } from "react";
import { CameraIcon } from "../../assets/icons/CameraIcon";
import ButtonIcon from "../ButtonIcon";

type ImageInputProps = {
  value?: File;
  onChange: (file?: File) => void;
  defaultImageUrl: string;
  errorMessage?: string;
};

export function FormImageInput({
  value,
  onChange,
  defaultImageUrl,
  errorMessage,
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
      <div className="absolute -top-1.25 -left-1.25">
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
          alt="Cover preview"
          className={`h-75 w-50 max-h-80 max-w-50 rounded-xl object-cover 
            ${errorMessage && "border border-red-500"} card`}
        />
      )}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

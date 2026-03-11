import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserDetailDTO } from "@repo/contracts/dto/user";
import { NO_IMAGE_URL } from "@/shared/constants";
import { useState } from "react";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormImageInput } from "@/shared/components/Form/FormImageInput";
import { useUserUpdateImage } from "../../hooks/useUserUpdateImage";
import { UserImageFormSchema, type UserImageForm } from "../../user.schema";

type Prop = {
  id: UserDetailDTO["id"];
  imageUrl?: UserDetailDTO["imageUrl"];
  onClose?: () => void;
};

type UserImageFormWithButton = UserImageForm & {
  showButtons?: boolean;
};

export function UserImageForm({ id, imageUrl, onClose }: Prop) {
  const { control, handleSubmit, watch, setValue, resetField } =
    useForm<UserImageFormWithButton>({
      resolver: zodResolver(UserImageFormSchema),
    });

  // showButtons is for UI purposes but it's not part of the form
  // to be sent in the api
  const showButtons = watch("showButtons", false);
  const { isPending, mutate } = useUserUpdateImage({ userId: id });
  const [inputKey, setInputKey] = useState(0);
  //Must put
  const onSubmit = (values: UserImageFormWithButton) => {
    mutate({
      formData: values,
      options: {
        onSuccess: async () => {
          setValue("showButtons", false, { shouldValidate: false });
          onClose && onClose();
        },
      },
    }); // File
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-50">
      <div className="h-45 w-45">
        <Controller
          control={control}
          name="imageUrl"
          render={({ field, fieldState }) => (
            <FormImageInput
              key={inputKey}
              value={field.value}
              onChange={(file) => {
                setValue("showButtons", true, { shouldValidate: false });
                field.onChange(file);
              }}
              shape="circle"
              width="w-45"
              height="h-45"
              defaultImageUrl={imageUrl ?? NO_IMAGE_URL}
              errorMessage={fieldState.error?.message}
              className="border-2 border-blue-500"
            />
          )}
        />
      </div>

      {showButtons && (
        <div className={`mt-4 flex-center gap-2`}>
          <div>
            <FormButton
              type={"submit"}
              isPending={isPending}
              isPendingLabel={"Saving..."}
              label={"Save"}
              className="flex-center"
            />
          </div>
          <div>
            <button
              className="form-button"
              type="button"
              onClick={() => {
                resetField("imageUrl");
                setInputKey((prev) => prev + 1);
                setValue("showButtons", false, { shouldValidate: false });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

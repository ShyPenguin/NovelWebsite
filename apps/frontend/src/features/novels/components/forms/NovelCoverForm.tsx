import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NovelCoverImageFormSchema } from "@/features/novels/novel.schema";
import type { NovelCoverImageFormWithButton } from "@/features/novels/novel.type";
import { useNovelCoverMutate } from "@/features/novels/hooks/useNovelCoverMutate";
import { NO_IMAGE_URL } from "@/shared/constants";
import { useState } from "react";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormImageInput } from "@/shared/components/Form/FormImageInput";

type Prop = {
  id: NovelDetailDTO["id"];
  coverImageUrl?: NovelDetailDTO["coverImageUrl"];
  onClose?: () => void;
};

export function NovelCoverForm({ id, coverImageUrl, onClose }: Prop) {
  const { control, handleSubmit, watch, setValue, resetField } =
    useForm<NovelCoverImageFormWithButton>({
      resolver: zodResolver(NovelCoverImageFormSchema),
    });

  // showButtons is for UI purposes but it's not part of the form
  // to be sent in the api
  const showButtons = watch("showButtons", false);
  const { isPending, mutate } = useNovelCoverMutate({ novelId: id });
  const [inputKey, setInputKey] = useState(0);
  //Must put
  const onSubmit = (values: NovelCoverImageFormWithButton) => {
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
      <div className="max-h-80">
        <Controller
          control={control}
          name="coverImage"
          render={({ field, fieldState }) => (
            <FormImageInput
              key={inputKey}
              value={field.value}
              onChange={(file) => {
                setValue("showButtons", true, { shouldValidate: false });
                field.onChange(file);
              }}
              defaultImageUrl={coverImageUrl ?? NO_IMAGE_URL}
              errorMessage={fieldState.error?.message}
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
                resetField("coverImage");
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

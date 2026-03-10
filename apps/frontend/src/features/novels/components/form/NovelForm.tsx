import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  NovelDetailDTO,
  NovelFormDTO,
  NovelFormInputDTO,
} from "@repo/contracts/dto/novel";
import { NovelFormSchema } from "@repo/contracts/schemas/novel";
import {
  language,
  novelStatus,
  novelTypes,
} from "@repo/contracts/fields/novel";
import { CREATE, EDIT } from "@/shared/constants";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormInput } from "@/shared/components/Form/FormInput";
import { FormTextArea } from "@/shared/components/Form/FormTextarea";
import type { MutateTypes } from "@/shared/types";
import { AuthorSelectDropDown } from "@/features/authors/components/AuthorSelectDropdown";
import DropdownSelect from "@/shared/components/DropdownButtons/DropdownSelect";
import { Schedule } from "@/shared/components/Schedule/Schedule";
import { getFormattedDate } from "@/shared/utils";
import { useNovelMutate } from "../../hooks/useNovelMutate";

type MutateNovelFormProp = {
  type: MutateTypes;
  novel?: NovelDetailDTO | null;
} & (
  | {
      type: typeof EDIT;
      novel: NovelDetailDTO;
      onClose: () => void;
    }
  | {
      type: typeof CREATE;
      onClose: (id: string) => void;
      novel?: null;
    }
);

const novelTypeOptions = novelTypes.map((t) => ({
  value: t,
  label: t,
}));

const novelLanguageOptions = language.map((t) => ({
  value: t,
  label: t,
}));

const novelStatusOption = novelStatus.map((t) => ({
  value: t,
  label: t,
}));

export const NovelForm = ({
  type,
  novel = null,
  onClose,
}: MutateNovelFormProp) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NovelFormSchema),
    defaultValues: {
      title: novel ? novel.title : "", //Done
      authorId: novel ? (novel.author ? novel.author.id : "") : "", //Done
      description: novel ? novel.description : "", //Done
      type: novel ? novel.type : "translated", //Done
      release: novel
        ? getFormattedDate(new Date(novel.release))
        : getFormattedDate(new Date()), // Done
      language: novel ? novel.language : "korean", //Done
      status: novel ? novel.status : "ONGOING",
      schedule: novel?.schedule ?? [],
      categories: novel
        ? novel.categories
          ? novel.categories.map((c) => c.id)
          : []
        : [],
    },
  });

  const typeValue = watch("type");

  const selectedType =
    novelTypeOptions.find((o) => o.value === typeValue) ?? novelTypeOptions[0];

  const mutation = useNovelMutate(novel);
  const { mutate, isPending } = mutation;

  const onSubmit: SubmitHandler<NovelFormDTO> = (data) => {
    mutate({
      formData: data,
      options: {
        onSuccess: (data) => {
          onClose(CREATE && data.id);
        },
      },
    });
  };
  return (
    <form
      className="novel-form grid-area-novel-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* TITLE */}
      <div className="[grid-area:a]">
        <FormInput<NovelFormInputDTO>
          label={"Title"}
          name="title"
          type={"text"}
          placeholder="Novel's title"
          errorMessage={errors.title?.message}
          register={register}
          className="max-w-full"
        />
      </div>
      {/* TYPE */}
      <div className="[grid-area:b] novel-form-child">
        <input type="hidden" {...register("type")} />
        <label className="form-label">Type</label>
        <div className="w-full">
          <DropdownSelect
            options={novelTypeOptions}
            selectedOption={selectedType}
            onChange={(option) => {
              setValue("type", option.value, { shouldValidate: true });
            }}
            className="max-w-full"
          />
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
      </div>
      {/* Language*/}
      <div className="[grid-area:c] novel-form-child">
        <label className="form-label">Language</label>
        <div className="w-full">
          <Controller
            name="language"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <DropdownSelect
                  options={novelLanguageOptions}
                  selectedOption={
                    novelLanguageOptions.find((o) => o.value === field.value) ??
                    novelLanguageOptions[0]
                  }
                  onChange={(option) => field.onChange(option.value)}
                  className="max-w-full"
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      {/* AUTHOR */}
      <div className="[grid-area:d] novel-form-child">
        <label className="form-label">Author</label>
        <div className="w-full">
          <Controller
            name="authorId"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <AuthorSelectDropDown
                  value={field.value}
                  onChange={field.onChange}
                  defaultValueName={
                    novel ? (novel.author ? novel.author.name : "") : ""
                  }
                  className="max-w-full"
                  errorMessage={fieldState.error?.message}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      {/* DATE */}
      <div className="[grid-area:e] novel-form-child">
        <FormInput<NovelFormInputDTO>
          label={"Release Date"}
          name="release"
          type={"date"}
          errorMessage={errors.release?.message}
          register={register}
          className="rounded-xl"
        />
      </div>
      {/* STATUS */}
      <div className="[grid-area:g] novel-form-child">
        <label className="form-label">Status</label>
        <div className="w-full max-w-42.5">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <DropdownSelect
                options={novelStatusOption}
                selectedOption={
                  novelStatusOption.find((o) => o.value === field.value) ??
                  novelStatusOption[0]
                }
                onChange={(option) => field.onChange(option.value)}
                className="max-w-full"
              />
            )}
          />
        </div>
      </div>
      {/* SCHEDULE */}
      <div className="[grid-area:i] novel-form-child">
        <label className="form-label">Schedule</label>
        <div className="flex w-full justify-center">
          <Controller
            name="schedule"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Schedule
                  schedule={field.value ? field.value : []}
                  onChange={({ on, day }: { on: boolean; day: string }) => {
                    const newValue = on
                      ? [...(field.value ?? []), day]
                      : field.value?.filter((d) => d !== day);

                    field.onChange(newValue);
                  }}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </div>
      {/* DESCRIPTION */}
      <div className="[grid-area:f] h-full min-h-0">
        <FormTextArea<NovelFormInputDTO>
          label={"Description"}
          name="description"
          placeholder="Novel's description"
          errorMessage={errors.description?.message}
          register={register}
        />
      </div>
      <div className="[grid-area:h] flex  justify-center pt-5">
        <div className="w-30">
          <FormButton
            type={"submit"}
            isPending={isPending}
            isPendingLabel={type == CREATE ? "Creating" : "Editing"}
            label={type == CREATE ? "Create" : "Edit"}
            className="flex justify-center"
          />
        </div>
      </div>
    </form>
  );
};

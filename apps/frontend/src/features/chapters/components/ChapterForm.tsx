import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@tanstack/react-router";
import type {
  ChapterFormDTO,
  ChapterFormParsedDTO,
} from "@repo/contracts/dto/chapter";
import { ChapterFormSchema } from "@repo/contracts/schemas/chapter";
import {
  chapterAccessTypes,
  chapterStatus,
} from "@repo/contracts/fields/chapters";
import { getFormattedDate } from "@/shared/utils/getFormattedDate";
import { addDays } from "@/shared/utils/addDays";
import { CREATE } from "@/shared/constants";
import DropdownSelect from "@/shared/components/DropdownButtons/DropdownSelect";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormInput } from "@/shared/components/Form/FormInput";
import { useChapterMutateUIType } from "@/features/chapters/stores/ChapterMutateUI/ChapterMutateUIProviders";
import { useMutatePreviewChapter } from "@/features/chapters/stores/ChapterMutateUI/MutatePreviewChapterContext";
import { usePreviewChapter } from "@/features/chapters/stores/ChapterMutateUI/PreviewChapterContext";

const chapterStatusOption = chapterStatus.map((t) => ({
  value: t,
  label: t,
}));

const chapterAccessOption = chapterAccessTypes.map((t) => ({
  value: t,
  label: t,
}));
export const ChapterForm = ({ totalChapter }: { totalChapter: number }) => {
  const { type, chapter } = useChapterMutateUIType();

  const url =
    type == CREATE
      ? "/novels_/$novelId/chapters_/create"
      : "/novels_/$novelId/chapters_/$chapterId/edit";

  const { novelId } = useParams({
    from: url,
  });

  const { mutate, isPending, variables } = useMutatePreviewChapter();
  const usePreview = type == CREATE ? usePreviewChapter() : null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChapterFormDTO, unknown, ChapterFormParsedDTO>({
    resolver: zodResolver(ChapterFormSchema),
    defaultValues: {
      chapterNumber: variables?.formData.chapterNumber
        ? variables.formData.chapterNumber
        : chapter
          ? chapter.chapterNumber
          : Number(totalChapter) + 1,
      sourceDocUrl: variables?.formData.sourceDocUrl
        ? variables.formData.sourceDocUrl
        : chapter?.sourceDocUrl && chapter.sourceDocUrl,
      status: variables?.formData.status
        ? variables.formData.status
        : chapter?.status && chapter.status,
      access: variables?.formData.access
        ? variables.formData.access
        : chapter?.access && chapter.access,
      publishedAt: variables?.formData.publishedAt
        ? getFormattedDate(new Date(variables.formData.publishedAt))
        : chapter?.publishedAt
          ? getFormattedDate(chapter.publishedAt)
          : getFormattedDate(addDays(new Date(), 7)),
    },
  });

  const onSubmit: SubmitHandler<ChapterFormParsedDTO> = (data) => {
    mutate({
      formData: data,
      novelId,
      options: {
        onSuccess: () => {
          if (usePreview) {
            usePreview.setPreviewed(true);
          }
        },
      },
    });
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <h4 className="font-semibold">
        {type == CREATE ? "Create Chapter" : "Edit Chapter"}
      </h4>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <FormInput<ChapterFormDTO>
              label={"Number"}
              name="chapterNumber"
              type={"number"}
              placeholder="totalChapter"
              errorMessage={errors.chapterNumber?.message}
              register={register}
              options={{ valueAsNumber: true }}
            />
            <FormInput<ChapterFormDTO>
              label={"Published Date"}
              name="publishedAt"
              type={"date"}
              errorMessage={errors.publishedAt?.message}
              register={register}
              className="rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            <div className="size-full flex flex-col gap-2">
              <label className="form-label">Status</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    options={chapterStatusOption}
                    selectedOption={
                      chapterStatusOption.find(
                        (o) => o.value === field.value,
                      ) ?? chapterStatusOption[0]
                    }
                    onChange={(option) => field.onChange(option.value)}
                    className="max-w-full"
                  />
                )}
              />
            </div>
            <div className="size-full flex flex-col gap-2">
              <label className="form-label">Access</label>
              <Controller
                name="access"
                control={control}
                render={({ field }) => (
                  <DropdownSelect
                    options={chapterAccessOption}
                    selectedOption={
                      chapterAccessOption.find(
                        (o) => o.value === field.value,
                      ) ?? chapterAccessOption[0]
                    }
                    onChange={(option) => field.onChange(option.value)}
                    className="max-w-full"
                  />
                )}
              />
            </div>
          </div>
          <FormInput<ChapterFormDTO>
            label={"Document Link"}
            name="sourceDocUrl"
            type={"text"}
            placeholder="Enter your link"
            errorMessage={errors.sourceDocUrl?.message}
            register={register}
          />
        </div>
        <div className="flex w-full justify-center">
          <div>
            <FormButton
              type={"submit"}
              isPending={isPending}
              isPendingLabel="Previewing"
              label="Preview"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

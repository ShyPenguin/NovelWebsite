import { CREATE, UPDATE } from "@/shared/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  AnnouncementDetailDTO,
  AnnouncementFormDTO,
} from "@repo/contracts/dto/announcement";
import { AnnouncementFormSchema } from "@repo/contracts/schemas/announcement";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormInput } from "@/shared/components/Form/FormInput";
import { useAnnouncementCreate } from "../../hooks/useAnnouncementCreate";
import { useAnnouncementUpdate } from "../../hooks/useAnnouncementUpdate";
import { useState } from "react";
import { FormTextArea } from "@/shared/components/Form/FormTextarea";
import { AnnouncementPreview } from "../AnnouncementPreview";
import { useAuth } from "@/features/auth/store/useAuth";

type AnnouncementFormProp = {
  type: "create" | "update";
  announcement?: AnnouncementDetailDTO;
} & (
  | {
      type: typeof UPDATE;
      onClose: () => void;
      announcement: AnnouncementDetailDTO;
    }
  | {
      type: typeof CREATE;
      onClose: (id: string) => void;
      announcement?: null;
    }
);
export const AnnouncementForm = ({
  type,
  announcement,
  onClose,
}: AnnouncementFormProp) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AnnouncementFormSchema),
    defaultValues: {
      title: announcement ? announcement.title : "",
      content: announcement ? announcement.content : "",
    },
  });

  const mutation = !announcement
    ? useAnnouncementCreate()
    : useAnnouncementUpdate(announcement);
  const onSubmit: SubmitHandler<AnnouncementFormDTO> = (data) => {
    mutation.mutate({
      formData: data,
      options: {
        onSuccess: (data) => onClose(CREATE && data.id),
      },
    });
  };
  const [mode, setMode] = useState<"edit" | "preview">(
    type == "update" ? "preview" : "edit",
  );
  const formValues = watch();
  const { data: user } = useAuth();
  return (
    <form
      className="flex flex-col gap-4 max-w-200 size-full flex-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className={`flex h-full min-h-[500px] w-full flex-col rounded-lg border`}
      >
        {/* Tabs */}
        <div className="flex border-b bg-muted/40">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "edit"
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "preview"
                ? "border-b-2 border-primary bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 flex flex-col gap-4">
          {mode === "edit" ? (
            <>
              <FormInput<AnnouncementFormDTO>
                label={"Title"}
                name="title"
                type={"text"}
                placeholder="Title"
                errorMessage={errors.title?.message}
                register={register}
              />
              <FormTextArea<AnnouncementFormDTO>
                label={"Content"}
                name="content"
                placeholder="Write your announcement using Markdown..."
                className="min-h-[300px]"
                errorMessage={errors.content?.message}
                register={register}
              />
            </>
          ) : (
            <AnnouncementPreview
              announcement={{
                title: formValues.title,
                createdAt: new Date(),
                updatedAt: new Date(),
                content: formValues.content,
                author: {
                  id: user!.id,
                  role: user!.role,
                  name: user!.name,
                  username: user!.username,
                },
              }}
            />
          )}
        </div>
      </div>
      <div className="w-30">
        <FormButton
          type={"submit"}
          isPending={mutation.isPending}
          isPendingLabel={type == CREATE ? "Creating" : "Updating"}
          label={type == CREATE ? "Create" : "Update"}
          className="flex justify-center"
        />
      </div>
    </form>
  );
};

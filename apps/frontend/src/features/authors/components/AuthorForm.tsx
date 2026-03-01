import { CREATE, UPDATE } from "@/shared/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  AuthorDetailDTO,
  AuthorFormDTO,
} from "@repo/contracts/dto/author";
import { AuthorFormSchema } from "@repo/contracts/schemas/author";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthorCreate } from "../hooks/useAuthorCreate";
import { useAuthorUpdate } from "../hooks/useAuthorUpdate";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormInput } from "@/shared/components/Form/FormInput";

type AuthorFormProp = {
  type: "create" | "update";
  author?: AuthorDetailDTO;
} & (
  | {
      type: typeof UPDATE;
      onClose: () => void;
      author: AuthorDetailDTO;
    }
  | {
      type: typeof CREATE;
      onClose: (id: string) => void;
      author?: null;
    }
);
export const AuthorForm = ({ type, author, onClose }: AuthorFormProp) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AuthorFormSchema),
    defaultValues: {
      name: author ? author.name : "",
    },
  });

  const mutation = !author ? useAuthorCreate() : useAuthorUpdate(author);
  const onSubmit: SubmitHandler<AuthorFormDTO> = (data) => {
    mutation.mutate({
      formData: data,
      options: {
        onSuccess: (data) => onClose(CREATE && data.id),
      },
    });
  };
  return (
    <form
      className="flex flex-col gap-4 max-w-100 size-full flex-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput<AuthorFormDTO>
        label={"Name"}
        name="name"
        type={"text"}
        placeholder="Author's name"
        errorMessage={errors.name?.message}
        register={register}
      />

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

import { FormButton } from "@/components/Form/FormButton";
import { FormInput } from "@/components/Form/FormInput";
import { CREATE, EDIT } from "@/constants";
import type { MutateTypes } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  AuthorFormDTO,
  AuthorThumbnailDTO,
} from "@repo/contracts/dto/author";
import { AuthorFormSchema } from "@repo/contracts/schemas/author";
import { useForm, type SubmitHandler } from "react-hook-form";

type AuthorFormProp = {
  type: MutateTypes;
  author?: AuthorThumbnailDTO;
} & (
  | {
      type: typeof EDIT;
      author: AuthorThumbnailDTO;
      onClose: () => void;
    }
  | {
      type: typeof CREATE;
      author?: null;
    }
);
export const AuthorForm = ({ type, author }: AuthorFormProp) => {
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

  const onSubmit: SubmitHandler<AuthorFormDTO> = (data) => {
    console.log(data);
  };
  return (
    <form
      className="flex flex-col gap-4 max-w-100 flex-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput<AuthorFormDTO>
        label={"Name"}
        name="name"
        type={"text"}
        placeholder="Author's name"
        errorMessage={errors.name?.message}
        register={register}
        options={{ valueAsNumber: true }}
      />

      <div className="w-30">
        <FormButton
          type={"submit"}
          isPending={false}
          isPendingLabel={type == CREATE ? "Creating" : "Editing"}
          label={type == CREATE ? "Create" : "Edit"}
          className="flex justify-center"
        />
      </div>
    </form>
  );
};

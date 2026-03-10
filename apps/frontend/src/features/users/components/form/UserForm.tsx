import { zodResolver } from "@hookform/resolvers/zod";
import type { UserDetailDTO, UserFormDTO } from "@repo/contracts/dto/user";
import { UserFormSchema } from "@repo/contracts/schemas/user";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormButton } from "@/shared/components/Form/FormButton";
import { FormInput } from "@/shared/components/Form/FormInput";
import { useUserUpdate } from "../../hooks/useUserUpdate";

export const UserForm = ({
  user,
  onClose,
}: {
  onClose: () => void;
  user: UserDetailDTO;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: user ? user.name : "",
    },
  });

  const mutation = useUserUpdate(user);
  const onSubmit: SubmitHandler<UserFormDTO> = (data) => {
    mutation.mutate({
      formData: data,
      options: {
        onSuccess: () => onClose(),
      },
    });
  };
  return (
    <form
      className="flex flex-col gap-4 max-w-100 size-full flex-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput<UserFormDTO>
        label={"Name"}
        name="name"
        type={"text"}
        placeholder="User's name"
        errorMessage={errors.name?.message}
        register={register}
      />

      <div className="w-30">
        <FormButton
          type={"submit"}
          isPending={mutation.isPending}
          isPendingLabel={"Updating"}
          label={"Update"}
          className="flex justify-center"
        />
      </div>
    </form>
  );
};

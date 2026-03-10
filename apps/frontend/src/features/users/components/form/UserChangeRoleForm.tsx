import { zodResolver } from "@hookform/resolvers/zod";
import type {
  UserDetailDTO,
  UserChangeRoleDTO,
} from "@repo/contracts/dto/user";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { FormButton } from "@/shared/components/Form/FormButton";
import { UserRoleChangeSchema } from "@repo/contracts/schemas/user";
import DropdownSelect from "@/shared/components/DropdownButtons/DropdownSelect";
import { userRoles } from "@repo/contracts/fields/users";
import { useUserChangeRole } from "../../hooks/useUserChangeRole";

const userRolesOptions = userRoles.map((t) => ({
  value: t,
  label: t,
}));

export const UserChangeRoleForm = ({
  user,
  onClose,
}: {
  onClose: () => void;
  user: UserDetailDTO;
}) => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(UserRoleChangeSchema),
    defaultValues: {
      role: user ? user.role : "user",
    },
  });

  const mutation = useUserChangeRole(user);
  const onSubmit: SubmitHandler<UserChangeRoleDTO> = (data) => {
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
      <div className="size-full flex flex-col gap-2">
        <label className="form-label">Role</label>
        <div className="w-full">
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <DropdownSelect
                  options={userRolesOptions}
                  selectedOption={
                    userRolesOptions.find((o) => o.value === field.value) ??
                    userRolesOptions[0]
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

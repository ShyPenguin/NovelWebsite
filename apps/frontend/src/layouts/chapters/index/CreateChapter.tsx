import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { queryAuthOption } from "@/auth/api/auth";

const roles = ["staff", "admin"];
export const CreateChapter = ({
  novelId,
}: {
  novelId: NovelDetailDTO["id"];
}) => {
  const { isSuccess, data } = useQuery(queryAuthOption());

  return (
    <>
      {isSuccess && data && roles.includes(data!.role) && (
        <Link
          className="full-button bg-secondary dark:bg-secondary-black dark:text-white"
          to="/novels/$novelId/chapters/create"
          params={{ novelId: novelId }}
        >
          Create Chapter
        </Link>
      )}
    </>
  );
};

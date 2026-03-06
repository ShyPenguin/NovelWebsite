import { Link } from "@tanstack/react-router";
import type { NovelDetailDTO } from "@repo/contracts/dto/novel";
import { NO_IMAGE_URL } from "@/shared/constants";
import Pencil from "@/assets/icons/Pencil";
import { Can } from "@/features/auth/components/Can";

export const NovelImage = ({
  coverImageUrl,
  id,
  translator,
}: {
  coverImageUrl: NovelDetailDTO["coverImageUrl"];
  id: NovelDetailDTO["id"];
  translator: NovelDetailDTO["translator"];
}) => {
  return (
    <div className="relative size-full">
      <img
        className="w-full h-125 md:h-132.5 lg:w-full lg:h-80 xl:h-107.5 2xl:h-112.5 rounded-xl dark:border-primary-black border-white border-4"
        src={coverImageUrl ?? NO_IMAGE_URL}
      />
      <Can resource="novels" action="update" ctx={{ data: { id, translator } }}>
        <div className="absolute top-0 right-0">
          <Link
            to="/novels/$novelId"
            params={{ novelId: id }}
            className="text-black dark:text-white hover:text-green-500 cursor-pointer 
            bg-white rounded-full dark:bg-primary-black flex p-2"
          >
            <Pencil className="w-5 h-5" />
          </Link>
        </div>
      </Can>
    </div>
  );
};

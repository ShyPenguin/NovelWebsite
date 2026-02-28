import { Can } from "@/auth/components/Can";
import HorizontalLine from "@/components/HorizontalLine";
import Page from "@/components/Page";
import { NO_IMAGE_URL } from "@/constants";
import { CHAPTER_SEARCH_DEFAULT } from "@/schemas/chapters";
import type { AuthorDetailDTO } from "@repo/contracts/dto/author";
import type { NovelThumbnailDTO } from "@repo/contracts/dto/novel";
import { Link } from "@tanstack/react-router";
import AuthorUpdateButton from "./AuthorUpdateButton";
import { AuthorDeleteButton } from "./AuthorDeleteButton";

const AuthorDetail = ({ author }: { author: AuthorDetailDTO }) => {
  return (
    <Page>
      <Page.Body type="center">
        <div className="size-full flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-2xl">Author: {author.name}</h1>
            <div className="flex gap-4">
              <Can resource="authors" action="update">
                <AuthorUpdateButton author={author} />
              </Can>
              <Can resource="authors" action="delete">
                <AuthorDeleteButton author={author} />
              </Can>
            </div>
          </div>
          <HorizontalLine />
          <h2>{author.name}'s Novels:</h2>
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Novels novels={author.novels} />
          </ul>
        </div>
      </Page.Body>
    </Page>
  );
};

const Novels = ({ novels }: { novels: NovelThumbnailDTO[] }) => {
  if (novels.length < 1) {
    return <p>No Novels</p>;
  }

  return (
    <>
      {novels.map((novel) => (
        <li key={novel.id}>
          <NovelCard novel={novel} />
        </li>
      ))}
    </>
  );
};

const NovelCard = ({ novel }: { novel: NovelThumbnailDTO }) => {
  return (
    <Link
      className="flex w-full gap-4 relative"
      to="/novels/$novelId/chapters"
      params={{ novelId: novel.id }}
      search={CHAPTER_SEARCH_DEFAULT}
    >
      <img
        className="h-full min-h-36.5 lg:min-h-45 w-25 lg:w-30 rounded-2xl object-cover"
        src={novel.coverImageUrl ? novel.coverImageUrl : NO_IMAGE_URL}
      />
      <div className="flex flex-col gap-2">
        <h1 className="text-primary-black dark:text-white font-bold text-lg line-clamp-1">
          {novel.title}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="line-clamp-5 text-[14px]">{novel.description}</p>
        </div>
      </div>
    </Link>
  );
};
export default AuthorDetail;

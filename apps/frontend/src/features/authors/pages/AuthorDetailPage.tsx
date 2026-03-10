import HorizontalLine from "@/shared/components/HorizontalLine";
import Page from "@/shared/components/Page";
import type { NovelThumbnailDTO } from "@repo/contracts/dto/novel";
import { getRouteApi } from "@tanstack/react-router";
import { Can } from "@/features/auth/components/Can";
import { useQuery } from "@tanstack/react-query";
import { authorQueryOptions } from "../api/fetchAuthor";
import { AuthorDeleteButton } from "../components/form/AuthorDeleteButton";
import AuthorUpdateButton from "../components/form/AuthorUpdateButton";
import { NovelThumbnail } from "@/features/novels/components/NovelThumbnail";

export const AuthorDetailPage = () => {
  const route = getRouteApi("/authors_/$authorId/");
  const { authorId } = route.useParams();

  const { data: author } = useQuery(authorQueryOptions(authorId));
  return (
    <Page>
      <Page.Body type="center">
        <div className="size-full flex flex-col gap-4">
          <div className="flex justify-between">
            <h1 className="text-2xl line-clamp-1">Author: {author!.name}</h1>
            <div className="flex gap-4">
              <Can
                resource="authors"
                action="update"
                ctx={{ data: { id: author!.id } }}
              >
                <AuthorUpdateButton author={author!} />
              </Can>
              <Can
                resource="authors"
                action="delete"
                ctx={{ data: { id: author!.id } }}
              >
                <AuthorDeleteButton author={author!} />
              </Can>
            </div>
          </div>
          <HorizontalLine />
          <Novels name={author!.name} novels={author!.novels} />
        </div>
      </Page.Body>
    </Page>
  );
};

const Novels = ({
  name,
  novels,
}: {
  name: string;
  novels: NovelThumbnailDTO[];
}) => {
  return (
    <>
      <h2>{name}'s Novels:</h2>
      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {novels.length > 0 ? (
          novels.map((novel) => (
            <li key={novel.id}>
              <NovelThumbnail novel={novel} />
            </li>
          ))
        ) : (
          <p>No Novels</p>
        )}
      </ul>
    </>
  );
};

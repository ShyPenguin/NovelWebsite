import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useChapterUpdate } from "@/features/chapters/hooks/useChapterUpdate";
import { useChapterCreate } from "@/features/chapters/hooks/useChapterCreate";
import { FormButton } from "@/shared/components/Form/FormButton";
import { Chevron } from "@/assets/icons/Chevron";
import House from "@/assets/icons/House";
import { CREATE } from "@/shared/constants";
import { PageNavbar } from "@/shared/layouts/PageNavbar";
import { useChapterMutateUIType } from "@/features/chapters/stores/ChapterMutateUI/ChapterMutateUIProviders";
import { useMutatePreviewChapter } from "@/features/chapters/stores/ChapterMutateUI/MutatePreviewChapterContext";
import { useNovelDetailOpen } from "@/features/chapters/stores/ChapterMutateUI/NovelDetailOpenContext";
import { CHAPTER_SEARCH_DEFAULT } from "../../chapter.schema";

export const MutateChapterNavbar = () => {
  const { isPending, mutate, variables } = useMutatePreviewChapter();
  const { chapter, type } = useChapterMutateUIType();
  const url =
    type == CREATE
      ? "/novels_/$novelId/chapters_/create"
      : "/novels_/$novelId/chapters_/$chapterId/edit";

  const { novelId } = useParams({
    from: url,
  });

  const handleButtonClick = () => {
    if (variables) {
      mutate(variables); // Retry with last variables
    } else if (chapter) {
      mutate({
        formData: {
          sourceDocUrl: chapter.sourceDocUrl,
          chapterNumber: chapter.chapterNumber,
          access: chapter.access,
          status: chapter.status,
          publishedAt: chapter.publishedAt,
        },
        novelId: chapter.novelId,
      });
    }
  };

  return (
    <PageNavbar>
      <div className="py-2 flex w-full h-full justify-between z-50">
        <div className="flex-1">
          <OpenNovelButton />
        </div>
        <div className="flex items-center justify-center gap-4">
          <FormButton
            type={"button"}
            isPending={isPending}
            isPendingLabel="Previewing"
            label="Preview Document"
            handleButton={handleButtonClick}
            className="truncate wrap-anywhere"
          />
          <Link
            className="reading-setting-card reading-setting-card-hover rounded-xl w-12"
            to="/novels/$novelId/chapters"
            params={{ novelId: novelId }}
            search={CHAPTER_SEARCH_DEFAULT}
          >
            <House className="w-4.25" />
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="max-w-[200px]">
            <MutateChapterButton />
          </div>
        </div>
      </div>
    </PageNavbar>
  );
};

const OpenNovelButton = () => {
  const { setNovelDetailOpen } = useNovelDetailOpen();

  return (
    <button
      className="pagination-buttons pagination-buttons-hover"
      onClick={() => setNovelDetailOpen(true)}
    >
      <Chevron isOpen={false} initialRotation="rotate-90" />

      <p className="hidden md:flex">Novel's Details</p>
    </button>
  );
};

const MutateChapterButton = () => {
  const { variables } = useMutatePreviewChapter();
  const { chapter } = useChapterMutateUIType();

  const createMutation = useChapterCreate();
  const updateMutation = chapter ? useChapterUpdate(chapter) : null;

  const isUpdate = !!chapter;
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isUpdate) {
      if (!updateMutation || !chapter) return;

      const payload = variables
        ? { formData: variables.formData }
        : {
            formData: {
              sourceDocUrl: chapter.sourceDocUrl,
              chapterNumber: chapter.chapterNumber,
              access: chapter.access,
              status: chapter.status,
              publishedAt: chapter.publishedAt,
            },
          };

      updateMutation.mutate({
        ...payload,
        options: {
          onSuccess: (data) => {
            navigate({
              to: "/novels/$novelId/chapters/$chapterId",
              params: {
                chapterId: data.id,
                novelId: data.novelId,
              },
            });
          },
        },
      });
      return;
    }

    // CREATE branch (fully narrowed)
    const payload = variables;
    if (!payload) return;

    createMutation.mutate({
      ...variables,
      options: {
        onSuccess: (data) => {
          navigate({
            to: "/novels/$novelId/chapters/$chapterId",
            params: {
              chapterId: data.id,
              novelId: data.novelId,
            },
          });
        },
      },
    });
  };

  const mutation = isUpdate ? updateMutation! : createMutation;

  return (
    <FormButton
      type="button"
      isPending={mutation.isPending}
      isPendingLabel={isUpdate ? "Updating" : "Creating"}
      label={isUpdate ? "Update" : "Create"}
      handleButton={handleButtonClick}
    />
  );
};

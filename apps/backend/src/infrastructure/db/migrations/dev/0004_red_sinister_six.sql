ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_novelId_userId_pk";--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_novelId_pk" PRIMARY KEY("userId","novelId");
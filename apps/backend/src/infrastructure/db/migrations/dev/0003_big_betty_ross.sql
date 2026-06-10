ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_novelId_userId_pk" PRIMARY KEY("novelId","userId");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_novel_id" ON "bookmarks" USING btree ("novelId");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_user_id" ON "bookmarks" USING btree ("userId");
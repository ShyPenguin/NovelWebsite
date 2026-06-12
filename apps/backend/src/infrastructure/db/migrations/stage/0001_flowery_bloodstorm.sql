CREATE TABLE "bookmarks" (
	"novelId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "bookmarks_userId_novelId_pk" PRIMARY KEY("userId","novelId")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_novelId_novels_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_bookmarks_novel_id" ON "bookmarks" USING btree ("novelId");--> statement-breakpoint
CREATE INDEX "idx_bookmarks_user_id" ON "bookmarks" USING btree ("userId");
ALTER TABLE "announcements" RENAME COLUMN "authorId" TO "author_id";--> statement-breakpoint
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_authorId_users_id_fk";
--> statement-breakpoint
DROP INDEX "idx_announcement_author_id";--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "content_html" text NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_announcement_author_id" ON "announcements" USING btree ("author_id");
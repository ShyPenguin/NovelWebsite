ALTER TABLE "novels" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "novels" ADD CONSTRAINT "novels_slug_unique" UNIQUE("slug");
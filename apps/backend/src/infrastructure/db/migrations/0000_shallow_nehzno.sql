CREATE TYPE "public"."chapter_access" AS ENUM('free', 'paid');--> statement-breakpoint
CREATE TYPE "public"."chapter_status" AS ENUM('draft', 'review', 'published');--> statement-breakpoint
CREATE TYPE "public"."language" AS ENUM('english', 'korean', 'chinese', 'japanese');--> statement-breakpoint
CREATE TYPE "public"."novelStatus" AS ENUM('ONGOING', 'COMPLETED', 'HIATUS', 'DROPPED');--> statement-breakpoint
CREATE TYPE "public"."novel_types" AS ENUM('original', 'translated');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('user', 'staff', 'supervisor', 'admin');--> statement-breakpoint
CREATE TYPE "public"."oauth_provides" AS ENUM('discord', 'github', 'google');--> statement-breakpoint
CREATE TYPE "public"."week_day" AS ENUM('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "authors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chapterNumber" integer NOT NULL,
	"novelId" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"source_doc_url" text NOT NULL,
	"content_html" text NOT NULL,
	"status" "chapter_status" DEFAULT 'draft' NOT NULL,
	"access" "chapter_access" DEFAULT 'free' NOT NULL,
	"publishedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid,
	"chapterId" uuid NOT NULL,
	"parentId" uuid,
	"comment" varchar(1000) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "novels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"authorId" uuid,
	"translatorId" uuid,
	"status" "novelStatus" DEFAULT 'ONGOING' NOT NULL,
	"release" timestamp with time zone DEFAULT now() NOT NULL,
	"type" "novel_types" DEFAULT 'translated' NOT NULL,
	"language" "language" DEFAULT 'korean' NOT NULL,
	"description" varchar(1000) NOT NULL,
	"rating" numeric(2, 1) DEFAULT '5.0' NOT NULL,
	"cover_image_url" text,
	"cover_image_path" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "novels_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "novelCategories" (
	"novelId" uuid NOT NULL,
	"categoryId" uuid NOT NULL,
	CONSTRAINT "novelCategories_novelId_categoryId_pk" PRIMARY KEY("novelId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"novelId" uuid NOT NULL,
	"reviewerId" uuid NOT NULL,
	"rating" numeric(2, 1) DEFAULT 1 NOT NULL,
	"review" varchar(10000) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"name" varchar(50) NOT NULL,
	"email" text NOT NULL,
	"role" "user_roles" DEFAULT 'user' NOT NULL,
	"image_url" varchar(512),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_oauth_accounts" (
	"userId" uuid NOT NULL,
	"provider" "oauth_provides" NOT NULL,
	"providerAccountId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_oauth_accounts_providerAccountId_provider_pk" PRIMARY KEY("providerAccountId","provider"),
	CONSTRAINT "user_oauth_accounts_providerAccountId_unique" UNIQUE("providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "novel_schedules" (
	"novelId" uuid NOT NULL,
	"day" "week_day" NOT NULL,
	CONSTRAINT "novel_schedules_novelId_day_pk" PRIMARY KEY("novelId","day")
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_novelId_novels_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_chapterId_chapters_id_fk" FOREIGN KEY ("chapterId") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_comments_id_fk" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "novels" ADD CONSTRAINT "novels_authorId_authors_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "novels" ADD CONSTRAINT "novels_translatorId_users_id_fk" FOREIGN KEY ("translatorId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "novelCategories" ADD CONSTRAINT "novelCategories_novelId_novels_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "novelCategories" ADD CONSTRAINT "novelCategories_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_novelId_novels_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_users_id_fk" FOREIGN KEY ("reviewerId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ADD CONSTRAINT "user_oauth_accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "novel_schedules" ADD CONSTRAINT "novel_schedules_novelId_novels_id_fk" FOREIGN KEY ("novelId") REFERENCES "public"."novels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_chapter_novel_id" ON "chapters" USING btree ("novelId");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unique_novel_chapter" ON "chapters" USING btree ("novelId","chapterNumber");--> statement-breakpoint
CREATE INDEX "idx_chapter_novelid_chapternumber" ON "chapters" USING btree ("novelId","chapterNumber" desc);--> statement-breakpoint
CREATE INDEX "idx_novel_author_id" ON "novels" USING btree ("authorId");--> statement-breakpoint
CREATE INDEX "idx_novel_translator_id" ON "novels" USING btree ("translatorId");--> statement-breakpoint
CREATE INDEX "idx_novel_category_novel_id" ON "novelCategories" USING btree ("novelId");--> statement-breakpoint
CREATE INDEX "idx_novel_category_category_id" ON "novelCategories" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "novel_idx" ON "reviews" USING btree ("novelId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_novel_reviewer_idx" ON "reviews" USING btree ("novelId","reviewerId");--> statement-breakpoint
CREATE INDEX "idx_novel_schedule_novel_id" ON "novel_schedules" USING btree ("novelId");
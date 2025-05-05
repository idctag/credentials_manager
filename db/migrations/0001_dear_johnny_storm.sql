ALTER TYPE "public"."credential_type" ADD VALUE 'env';--> statement-breakpoint
CREATE TABLE "database_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" uuid NOT NULL,
	"connection_string" varchar(500),
	"database_name" varchar(255),
	"username" varchar(255),
	"password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "env_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" uuid NOT NULL,
	"text" text
);
--> statement-breakpoint
CREATE TABLE "server_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" uuid,
	"server_address" varchar(255) NOT NULL,
	"username" varchar(255),
	"password" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "service_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" uuid,
	"url" varchar(500),
	"username" varchar(255),
	"password" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "database_credentials" ADD CONSTRAINT "database_credentials_credential_id_credentials_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "env_credentials" ADD CONSTRAINT "env_credentials_credential_id_credentials_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "server_credentials" ADD CONSTRAINT "server_credentials_credential_id_credentials_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_credentials" ADD CONSTRAINT "service_credentials_credential_id_credentials_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credentials" DROP COLUMN "details";
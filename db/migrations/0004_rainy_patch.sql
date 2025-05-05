ALTER TYPE "public"."project_role" RENAME TO "team_role";--> statement-breakpoint
ALTER TABLE "projects" RENAME TO "teams";--> statement-breakpoint
ALTER TABLE "project_groups" RENAME TO "team_groups";--> statement-breakpoint
ALTER TABLE "project_members" RENAME TO "team_members";--> statement-breakpoint
ALTER TABLE "credentials" RENAME COLUMN "project_id" TO "team_id";--> statement-breakpoint
ALTER TABLE "team_groups" RENAME COLUMN "project_id" TO "team_id";--> statement-breakpoint
ALTER TABLE "team_members" RENAME COLUMN "project_id" TO "team_id";--> statement-breakpoint
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "teams" DROP CONSTRAINT "projects_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "team_groups" DROP CONSTRAINT "project_groups_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "team_groups" DROP CONSTRAINT "project_groups_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "project_members_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "project_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "team_groups" DROP CONSTRAINT "project_groups_project_id_group_id_pk";--> statement-breakpoint
ALTER TABLE "team_members" DROP CONSTRAINT "project_members_project_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "database_credentials" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "env_credentials" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "server_credentials" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "service_credentials" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "team_groups" ADD CONSTRAINT "team_groups_team_id_group_id_pk" PRIMARY KEY("team_id","group_id");--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_user_id_pk" PRIMARY KEY("team_id","user_id");--> statement-breakpoint
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_groups" ADD CONSTRAINT "team_groups_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_groups" ADD CONSTRAINT "team_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
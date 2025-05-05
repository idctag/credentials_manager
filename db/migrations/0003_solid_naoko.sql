ALTER TABLE "database_credentials" ADD COLUMN "description" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "env_credentials" ADD COLUMN "description" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "server_credentials" ADD COLUMN "description" varchar(500) NOT NULL;--> statement-breakpoint
ALTER TABLE "service_credentials" ADD COLUMN "description" varchar(500) NOT NULL;
ALTER TABLE "database_credentials" ADD COLUMN "type" "credential_type" DEFAULT 'db_connection' NOT NULL;--> statement-breakpoint
ALTER TABLE "server_credentials" ADD COLUMN "type" "credential_type" DEFAULT 'server' NOT NULL;--> statement-breakpoint
ALTER TABLE "credentials" DROP COLUMN "type";
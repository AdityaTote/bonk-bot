import * as schema from "@/lib/db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

export interface Env {
	TURSO_DATABASE_URL: string;
	TURSO_AUTH_TOKEN: string;
	JWT_SECRET: string;
	SALT: string;
	SOLANA_RPC_URL: string;
	FRONTEND_URL: string;
}

export interface Val {
	user: {
		id: string;
		email: string;
		privateKey: string;
	};
	db: {
		instance: LibSQLDatabase<typeof schema>;
	};
}

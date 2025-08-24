import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { IServiceResponse } from "./base-service.types";
import type { IUser } from "@/lib/db/schema";
import * as schema from "@/lib/db/schema";

// Parameters
export interface IAuthService {
	db: LibSQLDatabase<typeof schema>;
	userData: {
		email: string;
		password: string;
		privateKey: string;
		publicKey: string;
	};
	JWT_SECRET: string;
	SALT?: string;
}

export interface IAuthLoginService {
	db: LibSQLDatabase<typeof schema>;
	userData: {
		email: string;
		password: string;
		publicKey?: string;
	};
	JWT_SECRET: string;
	SALT?: string;
}

// Responses
export interface IAuthServiceResponse extends IServiceResponse {
	data?: {
		user: {
			id: number;
			email: string;
			publicKey?: string;
		};
		token: string;
	};
}

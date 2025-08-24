import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { IServiceResponse } from "./base-service.types";
import * as schema from "@/lib/db/schema";

// parameters
export interface ICreateUser {
	user: {
		email: string;
		password: string;
		privateKey: string;
		publicKey: string;
	};
	db: LibSQLDatabase<typeof schema>;
}

export interface IGetUserByEmail {
	email: string;
	db: LibSQLDatabase<typeof schema>;
}

export interface IGetUserById {
	id: number;
	db: LibSQLDatabase<typeof schema>;
}

// responses

export interface ICreateUserResponse extends IServiceResponse {
	data?: {
		id: number;
		email: string;
		publicKey?: string;
	};
}

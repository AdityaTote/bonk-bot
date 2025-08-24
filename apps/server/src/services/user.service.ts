import { eq } from "drizzle-orm";
import { users, type IUser } from "@/lib/db/schema";
import type { IServiceResponse } from "@/types/services/base-service.types";
import type {
	ICreateUser,
	ICreateUserResponse,
	IGetUserByEmail,
	IGetUserById,
} from "@/types/services/user-service.types";

export class UserService {
	static async createUser({
		user,
		db,
	}: ICreateUser): Promise<ICreateUserResponse> {
		try {
			const createdUser = await db
				.insert(users)
				.values(user)
				.returning({
					id: users.id,
					email: users.email,
					publicKey: users.publicKey,
				})
				.get();
			return {
				error: false,
				message: "User created successfully",
				data: {
					...createdUser,
					publicKey: createdUser.publicKey ?? undefined,
				},
			};
		} catch (error) {
			return {
				error: true,
				message: "Failed to create user",
			};
		}
	}

	static async getUserByEmailLogin({
		email,
		db,
	}: IGetUserByEmail): Promise<IServiceResponse<IUser | null>> {
		try {
			const user = await db
				.select()
				.from(users)
				.where(eq(users.email, email))
				.get();
			return {
				error: false,
				message: "User retrieved successfully",
				data: user,
			};
		} catch (error) {
			return {
				error: true,
				message: "Failed to retrieve user",
			};
		}
	}

	static async getUserById({
		id,
		db,
	}: IGetUserById): Promise<IServiceResponse<Partial<IUser> | null>> {
		try {
			const user = await db
				.select({
					id: users.id,
					email: users.email,
					publicKey: users.publicKey,
					privateKey: users.privateKey,
				})
				.from(users)
				.where(eq(users.id, id))
				.get();
			return {
				error: false,
				message: "User retrieved successfully",
				data: user,
			};
		} catch (error) {
			return {
				error: true,
				message: "Failed to retrieve user",
			};
		}
	}

	static async getUserByEmail({
		email,
		db,
	}: IGetUserByEmail): Promise<IServiceResponse<Partial<IUser> | null>> {
		try {
			const user = await db
				.select({
					id: users.id,
					email: users.email,
					publicKey: users.publicKey,
					privateKey: users.privateKey,
				})
				.from(users)
				.where(eq(users.email, email))
				.get();
			return {
				error: false,
				message: "User retrieved successfully",
				data: user,
			};
		} catch (error) {
			return {
				error: true,
				message: "Failed to retrieve user",
			};
		}
	}
}

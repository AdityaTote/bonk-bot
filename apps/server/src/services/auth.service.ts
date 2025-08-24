import { sign, verify } from "hono/jwt";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { users } from "@/lib/db/schema";
import type { IJwtUserPayload } from "@/types/user";
import type {
	IAuthService,
	IAuthLoginService,
	IAuthServiceResponse,
} from "@/types/services/auth.types";
import { UserService } from "./user.service";

export class AuthService {
	private static async hashPass(
		password: string,
		salt: string
	): Promise<string> {
		return await hash(password, Number(salt));
	}

	private static async verifyPass(
		password: string,
		hash: string
	): Promise<boolean> {
		return await compare(password, hash);
	}

	private static async signToken(
		user: IJwtUserPayload,
		secret: string
	): Promise<string> {
		return await sign({ id: user.id }, secret);
	}

	public static async verifyToken(
		token: string,
		secret: string
	): Promise<IJwtUserPayload> {
		try {
			const payload = await verify(token, secret);
			// Ensure the payload has the expected structure
			if (typeof payload === "object" && payload && "id" in payload) {
				return { id: payload.id as number };
			}
			throw new Error("Invalid token payload");
		} catch (error) {
			throw new Error("Invalid token");
		}
	}

	public static async signup({
		db,
		userData,
		JWT_SECRET,
		SALT,
	}: IAuthService): Promise<IAuthServiceResponse> {
		try {
			const { email, password, privateKey, publicKey } = userData;

			if (!SALT) {
				return {
					error: true,
					message: "SALT is not defined",
				};
			}

			if (!privateKey || !publicKey) {
				return {
					error: true,
					message: "Private key and public key are required",
				};
			}

			// Hash the password
			const hashedPassword = await this.hashPass(password, SALT);

			// Save the user to the database

			const { data: user, error: createUserError } =
				await UserService.createUser({
					db,
					user: {
						email,
						password: hashedPassword,
						privateKey,
						publicKey,
					},
				});

			if (!user) {
				return {
					error: true,
					message: "Failed to create user",
				};
			}

			const token = await this.signToken({ id: user.id }, JWT_SECRET);

			return {
				error: false,
				message: "User created successfully",
				data: {
					user,
					token,
				},
			};
		} catch (error) {
			return {
				error: true,
				message: error instanceof Error ? error.message : "Signup failed",
			};
		}
	}

	public static async login({
		db,
		userData,
		JWT_SECRET,
		SALT,
	}: IAuthLoginService): Promise<IAuthServiceResponse> {
		try {
			const { email, password } = userData;

			// Find the user in the database
			const user = await db
				.select({
					id: users.id,
					email: users.email,
					password: users.password,
					publicKey: users.publicKey,
				})
				.from(users)
				.where(eq(users.email, email))
				.get();

			if (!user) {
				return {
					error: true,
					message: "User not found",
				};
			}

			// Verify the password
			const isValid = await this.verifyPass(password, user.password);

			if (!isValid) {
				return {
					error: true,
					message: "Invalid password",
				};
			}

			const token = await this.signToken({ id: user.id }, JWT_SECRET);

			return {
				error: false,
				message: "Login successful",
				data: {
					user: {
						id: user.id,
						email: user.email,
						publicKey: user.publicKey ?? undefined,
					},
					token,
				},
			};
		} catch (error) {
			return {
				error: true,
				message: error instanceof Error ? error.message : "Login failed",
			};
		}
	}
}

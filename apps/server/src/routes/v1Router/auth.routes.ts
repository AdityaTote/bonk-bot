import { hono } from "@/lib/hono";
import {
	signupValidator,
	loginValidator,
	type SignupValidator,
	type LoginValidator,
} from "@/lib/validator/auth.validator";
import { UserService } from "@/services/user.service";
import { AuthService } from "@/services/auth.service";
import { Solana } from "@/lib/solana";
import { initializeDatabase, validateEnvironment } from "@/lib/utlis/helper";

export const authRouter = hono();

authRouter.post("/signup", signupValidator, async (ctx) => {
	try {
		const { email, password }: SignupValidator = ctx.req.valid("json");

		// Validate environment variables
		const envValidation = validateEnvironment(ctx);
		if (!envValidation.isValid) {
			console.error(
				"Missing environment variables:",
				envValidation.missingVars
			);
			return ctx.json(
				{
					success: false,
					message: "Server configuration error",
					data: null,
				},
				500
			);
		}

		// Initialize database connection
		const { db, error: dbError } = await initializeDatabase(ctx);
		if (dbError || !db) {
			return ctx.json(
				{
					success: false,
					message: "Database connection failed",
				},
				500
			);
		}

		// Check if user already exists
		const { data: existingUser } = await UserService.getUserByEmail({
			email,
			db,
		});

		if (existingUser) {
			return ctx.json(
				{
					success: false,
					message: "User already exists",
				},
				409
			);
		}

		// Generate the keypair
		let privateKey: string, publicKey: string;
		try {
			const keyPair = Solana.generateKeyPair();
			privateKey = keyPair.privateKey;
			publicKey = keyPair.publicKey;
		} catch (keyError) {
			console.error("Keypair generation error:", keyError);
			return ctx.json(
				{
					success: false,
					message: "Failed to generate wallet keys",
				},
				500
			);
		}

		// Create the new user
		const {
			data: newUser,
			error: createError,
			message,
		} = await AuthService.signup({
			db,
			userData: { email, password, privateKey, publicKey },
			JWT_SECRET: ctx.env.JWT_SECRET,
			SALT: ctx.env.SALT,
		});

		if (createError) {
			console.error("User creation error:", message);
			return ctx.json(
				{
					success: false,
					message: message || "Failed to create user",
				},
				400
			);
		}

		return ctx.json(
			{
				success: true,
				message: "User signed up successfully",
				data: newUser,
			},
			201
		);
	} catch (error) {
		console.error("Unexpected error in signup:", error);
		return ctx.json(
			{
				success: false,
				message: "An unexpected error occurred",
			},
			500
		);
	}
});

authRouter.post("/signin", loginValidator, async (ctx) => {
	try {
		const { email, password }: LoginValidator = ctx.req.valid("json");

		// Validate environment variables
		const envValidation = validateEnvironment(ctx);
		if (!envValidation.isValid) {
			console.error(
				"Missing environment variables:",
				envValidation.missingVars
			);
			return ctx.json(
				{
					success: false,
					message: "Server configuration error",
				},
				500
			);
		}

		// Initialize database connection
		const { db, error: dbError } = await initializeDatabase(ctx);
		if (dbError || !db) {
			return ctx.json(
				{
					success: false,
					message: "Database connection failed",
				},
				500
			);
		}

		// Attempt login
		const {
			data: loginResult,
			error: loginError,
			message,
		} = await AuthService.login({
			db,
			userData: { email, password },
			JWT_SECRET: ctx.env.JWT_SECRET,
			SALT: ctx.env.SALT,
		});

		if (loginError) {
			console.error("Login error:", message);

			// Determine appropriate status code based on error message
			const statusCode = message?.toLowerCase().includes("not found")
				? 404
				: message?.toLowerCase().includes("invalid password")
					? 401
					: 400;

			return ctx.json(
				{
					success: false,
					message: message || "Login failed",
				},
				statusCode
			);
		}

		return ctx.json(
			{
				success: true,
				message: "Login successful",
				data: loginResult,
			},
			200
		);
	} catch (error) {
		console.error("Unexpected error in login:", error);
		return ctx.json(
			{
				success: false,
				message: "An unexpected error occurred",
			},
			500
		);
	}
});

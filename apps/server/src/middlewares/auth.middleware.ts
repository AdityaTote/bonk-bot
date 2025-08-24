import { initializeDatabase, validateEnvironment } from "@/lib/utlis/helper";
import { AuthService } from "@/services/auth.service";
import { UserService } from "@/services/user.service";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (ctx: Context, next) => {
	const headers = ctx.req.header("Authorization");
	if (!headers) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	const token = headers.split(" ")[1];

	if (!token) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	const data = await AuthService.verifyToken(token, ctx.env.JWT_SECRET);

	if (!data) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	const envValidation = validateEnvironment(ctx);
	if (!envValidation.isValid) {
		console.error("Missing environment variables:", envValidation.missingVars);
		return ctx.json(
			{
				error: true,
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
				error: true,
				message: "Database connection failed",
			},
			500
		);
	}

	const { data: userData, error: userError } = await UserService.getUserById({
		id: data.id,
		db: db,
	});

	if (userError || !userData) {
		return ctx.json({ error: "User not found" }, 404);
	}

	ctx.set("user", {
		id: userData.id,
		email: userData.email,
		privateKey: userData.privateKey,
	});

	ctx.set("db", {
		instance: db,
	});

	await next();
});

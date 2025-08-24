import { zValidator } from "@hono/zod-validator";
import z from "zod";

const signupSchema = z.object({
	email: z
		.string({
			message: "Email must be a string",
		})
		.email("Please enter a valid email address")
		.toLowerCase()
		.trim(),
	password: z
		.string({
			message: "Password must be a string",
		})
		.min(8, "Password must be at least 8 characters long")
		.max(128, "Password must be less than 128 characters"),
});

const loginSchema = z.object({
	email: z
		.string({
			message: "Email must be a string",
		})
		.email("Please enter a valid email address")
		.toLowerCase()
		.trim(),
	password: z
		.string({
			message: "Password must be a string",
		})
		.min(1, "Password is required")
		.max(128, "Password must be less than 128 characters"),
});

export const signupValidator = zValidator(
	"json",
	signupSchema,
	(result, ctx) => {
		if (!result.success) {
			return ctx.json(
				{
					error: true,
					message: "Validation failed",
					data: {
						errors: result.error.issues.map((err) => ({
							field: err.path.join("."),
							message: err.message,
						})),
					},
				},
				400
			);
		}
	}
);

export const loginValidator = zValidator("json", loginSchema, (result, ctx) => {
	if (!result.success) {
		return ctx.json(
			{
				error: true,
				message: "Validation failed",
				data: {
					errors: result.error.issues.map((err) => ({
						field: err.path.join("."),
						message: err.message,
					})),
				},
			},
			400
		);
	}
});

export type SignupValidator = z.infer<typeof signupSchema>;
export type LoginValidator = z.infer<typeof loginSchema>;

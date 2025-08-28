import { zValidator } from "@hono/zod-validator";
import z from "zod";

export const tnxSchema = z.object({
	txn: z.string(),
});

export type TnxSchema = z.infer<typeof tnxSchema>;

import { zValidator } from "@hono/zod-validator";
import z from "zod";

const tnxSchema = z.object({
	txn: z.string(),
});

export const tnxValidator = zValidator("json", tnxSchema);
export type TnxValidator = z.infer<typeof tnxSchema>;
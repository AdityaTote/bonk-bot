import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	client: {
		VITE_API_URL: z.string().url().optional(),
		VITE_SOLANA_RPC_URL: z.string().url().optional(),
	},
	clientPrefix: "VITE_",
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});

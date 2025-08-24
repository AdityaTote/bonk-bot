import { hono } from "@/lib/hono";
import { Solana } from "@/lib/solana";
import { tnxValidator, type TnxValidator } from "@/lib/validator/tnx.validator";
import { authMiddleware } from "@/middlewares/auth.middleware";

export const txnRouter = hono();

txnRouter.use(authMiddleware);

txnRouter.post("/sign", tnxValidator, async (ctx) => {
	try {
		const { id, privateKey } = ctx.get("user");

		// Validate required data
		if (!id || !privateKey) {
			return ctx.json(
				{
					success: false,
					message: "Missing user authentication data",
					data: null,
				},
				401
			);
		}

		const { txn }: TnxValidator = ctx.req.valid("json");

		const solana = new Solana({ rpcUrl: ctx.env.SOLANA_RPC_URL });

		try {
			// connect to solana rpc
			solana.connect();
		} catch (connectionError) {
			console.error("Solana connection failed:", connectionError);
			return ctx.json(
				{
					success: false,
					message: "Failed to connect to Solana network",
					data: null,
				},
				503
			);
		}

		let result;
		try {
			result = await solana.sendTransaction({
				serializedTx: txn,
				secretKey: privateKey,
			});
		} catch (transactionError: any) {
			console.error("Transaction submission failed:", {
				userId: id,
				error: transactionError.message || transactionError,
				timestamp: new Date().toISOString(),
			});

			// Handle specific Solana transaction errors
			if (transactionError.message?.includes("insufficient")) {
				return ctx.json(
					{
						success: false,
						message: "Insufficient funds for transaction",
						data: null,
					},
					400
				);
			}

			if (transactionError.message?.includes("blockhash")) {
				return ctx.json(
					{
						success: false,
						message: "Transaction expired, please try again",
						data: null,
					},
					400
				);
			}

			if (transactionError.message?.includes("signature verification")) {
				return ctx.json(
					{
						success: false,
						message: "Invalid signature or private key",
						data: null,
					},
					400
				);
			}

			return ctx.json(
				{
					success: false,
					message: "Transaction failed to process",
					data:
						process.env.NODE_ENV === "development"
							? transactionError.message
							: null,
				},
				500
			);
		}

		if (!result) {
			console.error("Transaction returned null/undefined result", {
				userId: id,
			});
			return ctx.json(
				{
					success: false,
					message: "Transaction failed - no result returned",
					data: null,
				},
				500
			);
		}

		// Log successful transaction
		console.log("Transaction successful:", {
			userId: id,
			signature: result,
			timestamp: new Date().toISOString(),
		});

		return ctx.json({
			success: true,
			message: "Transaction processed successfully",
			data: {
				signature: result,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (error: any) {
		// Catch-all error handler
		console.error("Unexpected error in transaction route:", {
			error: error.message || error,
			stack: error.stack,
			timestamp: new Date().toISOString(),
		});

		return ctx.json(
			{
				success: false,
				message: "An unexpected error occurred",
			},
			500
		);
	}
});

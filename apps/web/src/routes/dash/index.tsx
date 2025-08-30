import { useEffect, useState } from "react";
import {
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTitle } from "@/components/dashboard/DashboardTitle";
import { WalletBalanceCard } from "@/components/dashboard/WalletBalanceCard";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { SecurityBadge } from "@/components/dashboard/SecurityBadge";
import { BackgroundDecorations } from "@/components/dashboard/BackgroundDecorations";
import { useAuthStore } from "@/store/auth.store";
import { useTransact } from "@/hooks/api/tnx.hooks";
import { useConnection } from "@/store/connection.store";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AirDrop } from "@/components/dashboard/AirDrop";

export const Route = createFileRoute("/dash/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuthStore();
	const { connection } = useConnection();
	const { mutateAsync: createTransaction, error } = useTransact();

	const [message, setMessage] = useState<string | null>(null);

	const [balance, setBalance] = useState<number | null>(null);

	// Fetch balance function that can be called from anywhere
	const fetchBalance = async () => {
		if (user?.publicKey && connection) {
			try {
				const lamports = await connection.getBalance(
					new PublicKey(user.publicKey)
				);
				setBalance(lamports / LAMPORTS_PER_SOL);
			} catch {
				setBalance(null);
			}
		} else {
			setBalance(null);
		}
	};

	// Fetch balance when user or connection changes
	useEffect(() => {
		fetchBalance();
	}, [user?.publicKey, connection]);

	async function handleTransactionSubmit(data: {
		recipient: string;
		amount: string;
	}) {
		setMessage(null);
		try {
			// Create the transaction object
			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: new PublicKey(user!.publicKey),
					toPubkey: new PublicKey(data.recipient),
					lamports: Number(data.amount) * LAMPORTS_PER_SOL,
				})
			);

			transaction.feePayer = new PublicKey(user!.publicKey);
			const { blockhash } = await connection!.getLatestBlockhash("finalized");
			console.log("Fetched blockhash:", blockhash);
			transaction.recentBlockhash = blockhash;

			// Serialize the transaction to buffer
			const serializedTransaction = transaction.serialize({
				requireAllSignatures: false,
				verifySignatures: false,
			});

			console.log("Serialized Transaction:", serializedTransaction);

			const result = await createTransaction({
				txn: Buffer.from(serializedTransaction).toString("base64"),
			});

			if (result?.success) {
				setMessage(result.message || "Transaction submitted successfully!");
				fetchBalance();
			}
		} catch (err: any) {
			console.error("Transaction error:", err);
			setMessage(err?.message || "Transaction failed. Please try again.");
		}
	}

	return (
		<AuthGuard>
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
				<BackgroundDecorations />
				{/* Devnet warning banner */}
				<div className="mb-6 p-3 bg-yellow-200 text-yellow-900 border-l-4 border-yellow-500 rounded shadow text-center font-semibold">
					⚠️ This app works only on{" "}
					<span className="font-bold">Solana Devnet</span>. Do not use mainnet
					wallets or assets.
				</div>
				<DashboardHeader />
				<div className="container mx-auto max-w-2xl relative z-10">
					<DashboardTitle
						title="Solana Transaction Dashboard"
						description="Send SOL and SPL tokens with lightning-fast speeds"
					/>
					{/* AirDrop button and form */}
					<div className="mb-6">
						<AirDrop onAirdropSuccess={fetchBalance} />
					</div>
					<WalletBalanceCard balance={balance} />
					{error && (
						<div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
							{typeof error === "string"
								? error
								: error?.message || String(error)}
						</div>
					)}
					{message && (
						<div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
							{message}
						</div>
					)}
					<TransactionForm
						availableBalance={balance ?? 0}
						onSubmit={handleTransactionSubmit}
					/>
					<SecurityBadge />
				</div>
			</div>
		</AuthGuard>
	);
}

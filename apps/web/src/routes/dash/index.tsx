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

export const Route = createFileRoute("/dash/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuthStore();
	const { connection } = useConnection();
	const { mutateAsync: createTransaction } = useTransact();

	const walletBalance = {
		sol: 12.45,
	};

	async function handleTransactionSubmit(data: {
		recipient: string;
		amount: string;
	}) {

    console.log({
      formKey: user?.publicKey,
      recipient: data.recipient,
      amount: data.amount,
    });
		const ix = SystemProgram.transfer({
			fromPubkey: new PublicKey(user?.publicKey || ""),
			toPubkey: new PublicKey(data.recipient),
			lamports: Number(data.amount) * LAMPORTS_PER_SOL,
		});
		const tx = new Transaction().add(ix);

		const { blockhash } = await connection.getLatestBlockhash();
		tx.recentBlockhash = blockhash;
		tx.feePayer = new PublicKey(user?.publicKey || "");

		const serializedTx = tx.serialize({
			requireAllSignatures: false,
			verifySignatures: false,
		});

		console.log(serializedTx);

		await createTransaction({
			txn: Buffer.from(serializedTx).toString("base64"),
		});
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
			<BackgroundDecorations />

			<DashboardHeader />

			<div className="container mx-auto max-w-2xl relative z-10">
				<DashboardTitle
					title="Solana Transaction Dashboard"
					description="Send SOL and SPL tokens with lightning-fast speeds"
				/>

				<WalletBalanceCard balance={walletBalance} />

				<TransactionForm
					availableBalance={walletBalance.sol}
					onSubmit={handleTransactionSubmit}
				/>

				<SecurityBadge />
			</div>
		</div>
	);
}

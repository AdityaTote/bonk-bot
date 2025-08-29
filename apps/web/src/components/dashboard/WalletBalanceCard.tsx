import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletBalanceCardProps {
	balance: number | null;
}

export function WalletBalanceCard({ balance }: WalletBalanceCardProps) {
	return (
		<Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<span className="text-xl">💰</span>
					<span className="text-gray-900 dark:text-white">Wallet Balance</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
					<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
						{balance !== null ? balance.toFixed(2) : "Loading..."}
					</div>
					<div className="text-sm text-gray-600 dark:text-gray-300">SOL</div>
				</div>
			</CardContent>
		</Card>
	);
}

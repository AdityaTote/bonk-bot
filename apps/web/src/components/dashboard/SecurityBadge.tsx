export function SecurityBadge() {
	return (
		<div className="mt-6 text-center">
			<div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
				<span className="text-green-500">🔒</span>
				<span className="text-xs text-gray-600 dark:text-gray-300">
					All transactions are secured by Solana blockchain
				</span>
			</div>
		</div>
	);
}

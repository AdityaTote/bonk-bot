export const Footer = () => (
	<footer className="relative z-10 border-t border-gray-200 dark:border-gray-700 mt-20">
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row justify-between items-center">
				<div className="flex items-center space-x-2 mb-4 md:mb-0">
					<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
						<span className="text-sm font-bold text-white">🐕</span>
					</div>
					<span className="text-gray-900 dark:text-white font-bold">
						Bonk Bot
					</span>
				</div>
				<div className="text-gray-500 dark:text-gray-400 text-sm">
					© 2025 Bonk Bot. Powered by Solana.
				</div>
			</div>
		</div>
	</footer>
);

export const DashboardHeader = () => (
	<header className="relative z-10 mb-8">
		<nav className="container mx-auto flex items-center justify-between">
			<div className="flex items-center space-x-2">
				<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
					<span className="text-xl font-bold text-white">🐕</span>
				</div>
				<span className="text-2xl font-bold text-gray-900 dark:text-white">
					Bonk Bot
				</span>
			</div>
		</nav>
	</header>
);

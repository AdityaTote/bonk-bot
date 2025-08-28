export const Header = () => (
	<header className="relative z-10 px-4 py-6">
		<nav className="container mx-auto flex items-center justify-between">
			<div className="flex items-center space-x-2">
				<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
					<span className="text-xl font-bold text-white">🐕</span>
				</div>
				<span className="text-2xl font-bold text-gray-900 dark:text-white">
					Bonk Bot
				</span>
			</div>
			<div className="hidden md:flex items-center space-x-8">
				<a
					href="#features"
					className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
				>
					Features
				</a>
				<a
					href="#how-it-works"
					className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
				>
					How it Works
				</a>
				<a
					href="#about"
					className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
				>
					About
				</a>
			</div>
		</nav>
	</header>
);

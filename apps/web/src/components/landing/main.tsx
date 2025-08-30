import { useAuthStore } from "@/store/auth.store";
import { Link } from "@tanstack/react-router";

export const Main = () => {
	const { user } = useAuthStore();
	return (
		<main className="relative z-10 container mx-auto px-4 py-12">
			<div className="text-center mb-16">
				<div className="mb-6">
					<span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
						🚀 Powered by Solana Blockchain
					</span>
				</div>
				<h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
					Trade{" "}
					<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						BONK
					</span>
					<br />
					Like a Pro
				</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
					The ultimate Solana DApp for seamless cryptocurrency transactions.
					Create your account, connect your wallet, and start trading with
					lightning-fast speeds and minimal fees.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Link
						to={user ? "/dash" : "/signup"}
						className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
					>
						Get Started
						<span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
							→
						</span>
					</Link>
					{!user?.email && (
						<Link
							to="/signin"
							className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
						>
							Sign In
						</Link>
					)}
				</div>
			</div>

			{/* Features Section */}
			<section id="features" className="mb-20">
				<h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
					Why Choose Bonk Bot?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="p-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
						<div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
							<span className="text-2xl">⚡</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Lightning Fast
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Execute trades in milliseconds with Solana's high-performance
							blockchain technology.
						</p>
					</div>
					<div className="p-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
						<div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-6">
							<span className="text-2xl">🔒</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Secure Wallet
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Your Solana account is created securely and protected with
							industry-leading security measures.
						</p>
					</div>
					<div className="p-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
						<div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-6">
							<span className="text-2xl">💰</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Low Fees
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Enjoy minimal transaction fees compared to traditional blockchain
							networks.
						</p>
					</div>
				</div>
			</section>

			{/* How it Works */}
			<section id="how-it-works" className="mb-20">
				<h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
					How It Works
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">1</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Sign Up
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Create your account and we'll automatically generate a secure
							Solana wallet for you.
						</p>
					</div>
					<div className="text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">2</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Connect & Fund
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Sign in to access your wallet and fund it with SOL or other
							supported tokens.
						</p>
					</div>
					<div className="text-center">
						<div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-2xl font-bold text-white">3</span>
						</div>
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							Start Trading
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Execute fast, secure transactions with BONK and other Solana
							tokens.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="text-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-12 border border-blue-200 dark:border-blue-800">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
					Ready to Start Trading?
				</h2>
				<p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
					Join thousands of traders who trust Bonk Bot for their Solana
					transactions.
				</p>
				<Link
					to="/signup"
					className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
				>
					Create Your Wallet Now
				</Link>
			</section>
		</main>
	);
};

import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Main } from "@/components/landing/main";
import { Connection } from "@solana/web3.js";
import { useConnection } from "@/store/connection.store";

export const Route = createFileRoute("/")({
	component: HomePage,
});

const connection = new Connection("https://api.devnet.solana.com");

function HomePage() {
	useConnection().setConnection(connection);
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
			<Background />
			<Header />
			<Main />
			<Footer />
		</div>
	);
}

const Background = () => (
	<div className="absolute inset-0 opacity-30 dark:opacity-20">
		<div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-3xl"></div>
		<div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-400/10 rounded-full blur-3xl"></div>
		<div className="absolute bottom-10 left-1/2 w-80 h-80 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-3xl"></div>
	</div>
);

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const DashboardHeader = () => {
	const { clearUser } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		clearUser();
		navigate({ to: "/" });
	};

	return (
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
				<Button
					variant="outline"
					size="sm"
					onClick={handleLogout}
					className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
				>
					Logout
				</Button>
			</nav>
		</header>
	);
};

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { user } = useAuthStore();

	useEffect(() => {
		if (!user?.email) {
			router.navigate({ to: "/signin", replace: true });
		}
	}, [user, router]);

	if (!user?.email) return null;
	return <>{children}</>;
}

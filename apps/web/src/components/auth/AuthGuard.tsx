import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { user, isHydrated } = useAuthStore();

	useEffect(() => {
		if (isHydrated && (!user || !user.email)) {
			router.navigate({ to: "/signin", replace: true });
		}
	}, [user, router, isHydrated]);

	// Don't render anything until hydrated or if user is not authenticated
	if (!isHydrated || !user || !user.email) return null;

	return <>{children}</>;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
	email: string;
	publicKey: string;
	token: string;
}

type AuthStore = {
	// state
	user: User | null; // Allow null for logged-out state
	isHydrated: boolean; // Track hydration state
	// actions
	setUser: (user: User) => void;
	clearUser: () => void; // Add logout functionality
	setIsHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// state
			user: null, // Start with null (not logged in)
			isHydrated: false,

			// actions
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
			setIsHydrated: (hydrated) => set({ isHydrated: hydrated }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ user: state.user }),
			onRehydrateStorage: () => (state) => {
				state?.setIsHydrated(true);
			},
		}
	)
);

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
	// actions
	setUser: (user: User) => void;
	clearUser: () => void; // Add logout functionality
};

export const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			// state
			user: null, // Start with null (not logged in)

			// actions
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ user: state.user }),
		}
	)
);

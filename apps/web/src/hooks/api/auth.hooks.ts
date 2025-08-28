import { api } from "@/lib/api/axios";
import { type AuthSchema } from "@/lib/validator/auth.validator";
import { useAuthStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";

export const useSignup = () => {
	return useMutation({
		mutationKey: ["signup"],
		mutationFn: async (data: AuthSchema) => await api.auth.signup(data),
		onSuccess: (data) => {
			if (data.success) {
				useAuthStore.getState().setUser({
					email: data.data.user.email,
					publicKey: data.data.user.publicKey || "",
					token: data.data.token,
				});
			} else {
				console.error("Signup failed:", data.message);
				useAuthStore.getState().clearUser();
				throw new Error(data.message || "Signup failed");
			}
		},
		onError: (error) => {
			console.error("Signup failed:", error);
			useAuthStore.getState().clearUser();
		},
	});
};

export const useSignin = () => {
	return useMutation({
		mutationKey: ["signin"],
		mutationFn: async (data: AuthSchema) => await api.auth.signin(data),
		onSuccess: (data) => {
			if (data.success) {
				useAuthStore.getState().setUser({
					email: data.data.user.email,
					publicKey: data.data.user.publicKey || "",
					token: data.data.token,
				});
			} else {
				console.error("Signin failed:", data.message);
				useAuthStore.getState().clearUser();
				throw new Error(data.message || "Signin failed");
			}
		},
		onError: (error) => {
			console.error("Signin failed:", error);
			useAuthStore.getState().clearUser();
		},
	});
};

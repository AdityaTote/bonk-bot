import { FormEvent, useRef, useState } from "react";
import { createFileRoute, useRouter, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth.store";
import { AuthForm } from "@/components/auth/AuthComp";
import { useSignup } from "@/hooks/api/auth.hooks";
import { authSchema } from "@/lib/validator/auth.validator";

function SignUp() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string>("");
	const { mutateAsync: signup } = useSignup();
	const router = useRouter();

	const handleSignIn = async (e: FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			const { success, data, error } = authSchema.safeParse({
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
			});
		} catch (error: any) {
			console.error("Signup failed:", error);
			setError(error?.message || "Account creation failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthForm
			authType="signup"
			emailRef={emailRef}
			passwordRef={passwordRef}
			onSubmit={handleSignIn}
			isSubmitting={isSubmitting}
			error={error}
		/>
	);
}

export const Route = createFileRoute("/__auth/signup")({
	beforeLoad: () => {
		const user = useAuthStore.getState().user;
		if (user?.email) {
			throw redirect({ to: "/dash" });
		}
	},
	component: SignUp,
});

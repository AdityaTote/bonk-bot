import { FormEvent, useRef, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth/AuthComp";
import { useSignin } from "@/hooks/api/auth.hooks";
import { authSchema } from "@/lib/validator/auth.validator";

export const Route = createFileRoute("/__auth/signin")({
	component: SignIn,
});

function SignIn() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string>("");
	const { mutateAsync: signIn } = useSignin();
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

			if (!success) {
				const firstError = error.issues[0];
				setError(firstError?.message || "Validation failed");
				return;
			}

			await signIn({ email: data.email, password: data.password });
			router.navigate({
				to: "/dash",
			});
		} catch (error: any) {
			console.error("Signin failed:", error);
			setError(error?.message || "Login failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthForm
			authType="signin"
			emailRef={emailRef}
			passwordRef={passwordRef}
			onSubmit={handleSignIn}
			isSubmitting={isSubmitting}
			error={error}
		/>
	);
}

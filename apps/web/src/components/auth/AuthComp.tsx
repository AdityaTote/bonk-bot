import { Link } from "@tanstack/react-router";
import { FormEvent, RefObject } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Route as signinRouter } from "@/routes/__auth/signin";
import { Route as signupRouter } from "@/routes/__auth/signup";

interface AuthFormProps {
	authType: "signin" | "signup";
	emailRef: RefObject<HTMLInputElement | null>;
	passwordRef: RefObject<HTMLInputElement | null>;
	onSubmit?: (e: FormEvent) => void;
	isSubmitting: boolean;
	error?: string;
}

export function AuthForm({
	emailRef,
	passwordRef,
	authType,
	onSubmit,
	isSubmitting,
	error,
}: AuthFormProps) {
	const signin = {
		cardTitle: "Welcome Back",
		cardDescription: "Sign in to your account to continue",
		buttonText: "Sign In",
		linkText: "Create Account",
		footer: (
			<div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
				Don&apos;t have an account?{" "}
				<Link
					to={signupRouter.to}
					className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline underline-offset-4 transition-colors"
				>
					Sign up
				</Link>
			</div>
		),
	};

	const signup = {
		cardTitle: "Create Your Account",
		cardDescription:
			"Join us today and start managing your Solana transactions",
		buttonText: "Create Account",
		linkText: "Sign In",
		footer: (
			<div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
				Already have an account?{" "}
				<Link
					to={signinRouter.to}
					className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline underline-offset-4 transition-colors"
				>
					Sign in
				</Link>
			</div>
		),
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
			<div className="w-full max-w-md">
				<Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
					<CardHeader className="space-y-2 pb-6">
						<CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
							{authType === "signin" ? signin.cardTitle : signup.cardTitle}
						</CardTitle>
						<CardDescription className="text-center text-gray-600 dark:text-gray-400">
							{authType === "signin"
								? signin.cardDescription
								: signup.cardDescription}
						</CardDescription>
					</CardHeader>
					<CardContent className="px-6 pb-6">
						<form onSubmit={onSubmit} className="space-y-6">
							{error && (
								<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
									{error}
								</div>
							)}
							<div className="space-y-4">
								<div className="space-y-2">
									<Label
										htmlFor="email"
										className="text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Email Address
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										ref={emailRef}
										required
										className="h-11 px-4 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="password"
										className="text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Password
									</Label>
									<Input
										id="password"
										type="password"
										placeholder="Enter your password"
										ref={passwordRef}
										required
										className="h-11 px-4 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-100"
									/>
								</div>
							</div>

							<div className="space-y-3">
								<Button
									type="submit"
									className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center space-x-2">
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											<span>
												{authType === "signin"
													? "Signing In..."
													: "Creating Account..."}
											</span>
										</div>
									) : authType === "signin" ? (
										signin.buttonText
									) : (
										signup.buttonText
									)}
								</Button>
							</div>
							{authType === "signin" ? signin.footer : signup.footer}
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

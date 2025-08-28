import { useState } from "react";
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

interface TransactionFormProps {
	availableBalance: number;
	onSubmit: (data: { recipient: string; amount: string }) => Promise<void>;
}

interface FormErrors {
	address?: string;
	amount?: string;
}

export function TransactionForm({
	availableBalance,
	onSubmit,
}: TransactionFormProps) {
	const [recipientAddress, setRecipientAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<FormErrors>({});

	const validateForm = () => {
		const newErrors: FormErrors = {};

		// Validate Solana address (basic validation)
		if (!recipientAddress.trim()) {
			newErrors.address = "Recipient address is required";
		} else if (recipientAddress.length < 32 || recipientAddress.length > 44) {
			newErrors.address = "Invalid Solana address format";
		}

		// Validate amount
		if (!amount.trim()) {
			newErrors.amount = "Amount is required";
		} else if (isNaN(Number(amount)) || Number(amount) <= 0) {
			newErrors.amount = "Amount must be a positive number";
		} else if (Number(amount) > availableBalance) {
			newErrors.amount = "Insufficient balance";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			await onSubmit({
				recipient: recipientAddress,
				amount: amount,
			});

			// Reset form on success
			setRecipientAddress("");
			setAmount("");
		} catch (error) {
			console.error("Transaction failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<span className="text-xl">🚀</span>
					<span className="text-gray-900 dark:text-white">
						Send Transaction
					</span>
				</CardTitle>
				<CardDescription className="text-gray-600 dark:text-gray-300">
					Transfer SOL to any Solana address instantly
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Recipient Address Field */}
					<div className="space-y-2">
						<Label
							htmlFor="recipient"
							className="text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Recipient Address
						</Label>
						<Input
							id="recipient"
							type="text"
							placeholder="Enter Solana public key (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)"
							value={recipientAddress}
							onChange={(e) => setRecipientAddress(e.target.value)}
							className={`h-12 px-4 border transition-colors dark:bg-gray-700/50 dark:text-gray-100 ${
								errors.address
									? "border-red-500 focus:border-red-500 focus:ring-red-500"
									: "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
							}`}
						/>
						{errors.address && (
							<p className="text-sm text-red-600 dark:text-red-400">
								{errors.address}
							</p>
						)}
						<p className="text-xs text-gray-500 dark:text-gray-400">
							Enter a valid Solana wallet address (32-44 characters)
						</p>
					</div>

					{/* Amount Field */}
					<div className="space-y-2">
						<Label
							htmlFor="amount"
							className="text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Amount (SOL)
						</Label>
						<div className="relative">
							<Input
								id="amount"
								type="number"
								step="0.000000001"
								min="0"
								placeholder="0.00"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								className={`h-12 px-4 pr-16 border transition-colors dark:bg-gray-700/50 dark:text-gray-100 ${
									errors.amount
										? "border-red-500 focus:border-red-500 focus:ring-red-500"
										: "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
								}`}
							/>
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
								SOL
							</div>
						</div>
						{errors.amount && (
							<p className="text-sm text-red-600 dark:text-red-400">
								{errors.amount}
							</p>
						)}
						<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
							<span>Minimum: 0.000000001 SOL</span>
							<span>Available: {availableBalance.toFixed(2)} SOL</span>
						</div>
					</div>

					{/* Transaction Fee Info */}
					<div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
						<div className="flex justify-between items-center text-sm">
							<span className="text-gray-600 dark:text-gray-300">
								Network Fee:
							</span>
							<span className="text-gray-900 dark:text-white font-medium">
								~0.000005 SOL
							</span>
						</div>
						<div className="flex justify-between items-center text-sm mt-1">
							<span className="text-gray-600 dark:text-gray-300">
								Total Cost:
							</span>
							<span className="text-gray-900 dark:text-white font-medium">
								{amount && !isNaN(Number(amount)) && Number(amount) > 0
									? `${(Number(amount) + 0.000005).toFixed(9)} SOL`
									: "0 SOL"}
							</span>
						</div>
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<div className="flex items-center justify-center space-x-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Processing Transaction...</span>
							</div>
						) : (
							<div className="flex items-center justify-center space-x-2">
								<span>Send Transaction</span>
								<span>→</span>
							</div>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

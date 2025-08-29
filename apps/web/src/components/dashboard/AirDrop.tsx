import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useConnection } from "@/store/connection.store";
import { useAuthStore } from "@/store/auth.store";

export function AirDrop() {
	const [showForm, setShowForm] = useState(false);
	const [amount, setAmount] = useState("");
	const [message, setMessage] = useState<{ text: string; type: string }>({
		text: "",
		type: "",
	});
	const { connection } = useConnection();
	const { user } = useAuthStore();

	useEffect(() => {
		if (message.text) {
			const timer = setTimeout(() => {
				setMessage({ text: "", type: "" });
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [message]);

	async function handleRequestAirDrop() {
		try {
			if (amount === "") {
				setMessage({
					text: "Please enter the amount of SOL to airdrop",
					type: "error",
				});
			} else if (isNaN(Number(amount))) {
				setMessage({ text: "Please enter a valid number", type: "error" });
			} else if (!user?.publicKey) {
				setMessage({ text: "User wallet not found", type: "error" });
			} else {
				const intAmount = parseFloat(amount);
				await connection.requestAirdrop(
					new PublicKey(user.publicKey),
					intAmount * LAMPORTS_PER_SOL
				);
				setMessage({
					text: `Airdrop of ${intAmount} SOL requested`,
					type: "success",
				});
				setAmount("");
			}
		} catch (error) {
			setAmount("");
			setMessage({ text: "Error requesting airdrop", type: "error" });
		}
	}

	const handleClick = () => {
		setShowForm(!showForm);
		if (!showForm && !user?.publicKey) {
			setMessage({ text: "User wallet not found", type: "error" });
		} else if (showForm) {
			setMessage({ text: "", type: "" });
		}
	};

	return (
		<div className="mb-6">
			<div className="flex justify-end">
				<button
					className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold shadow"
					onClick={handleClick}
				>
					AirDrop
				</button>
			</div>
			{showForm && (
				<div className="flex flex-col sm:flex-row items-center justify-end mt-4 gap-2">
					<input
						type="text"
						placeholder="Amount of SOL"
						className="rounded-lg border border-gray-300 px-4 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
					/>
					<button
						className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 font-semibold"
						onClick={handleRequestAirDrop}
					>
						Drop
					</button>
				</div>
			)}
			{message.text && (
				<div
					className={`mt-4 p-3 rounded-lg text-center font-medium ${message.type === "error" ? "bg-red-100 text-red-700 border border-red-300" : "bg-green-100 text-green-700 border border-green-300"}`}
				>
					{message.text}
				</div>
			)}
		</div>
	);
}

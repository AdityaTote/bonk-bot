import { Connection, Keypair, Transaction } from "@solana/web3.js";
import { Buffer } from "node:buffer";
import bs58 from "bs58";

interface SendTransactionParams {
	serializedTx: string;
	secretKey: string;
}

export class Solana {
	private connection: Connection | null = null;

	constructor(private config: { rpcUrl: string }) {}

	connect() {
		if (!this.connection) {
			this.connection = new Connection(this.config.rpcUrl);
		}
		this.connection = new Connection(this.config.rpcUrl);
		return this.connection;
	}

	static generateKeyPair() {
		try {
			const keypair = new Keypair();
			return {
				publicKey: keypair.publicKey.toString(),
				privateKey: keypair.secretKey.toString(),
			};
		} catch (error) {
			throw new Error(
				`Failed to generate keypair: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}

	static validateSerializedTransaction(serializedTx: string): {
		isValid: boolean;
		format?: "base58" | "hex" | "utf8" | "uint8array" | "buffer" | "base64";
		error?: string;
		details?: string;
	} {
		console.log("Validating transaction format...");
		console.log("Input type:", typeof serializedTx);
		console.log("Input length:", serializedTx.length);
		console.log("First 100 chars:", serializedTx.substring(0, 100));
		console.log(
			"Last 50 chars:",
			serializedTx.substring(Math.max(0, serializedTx.length - 50))
		);

		// Check for empty or whitespace-only input
		if (!serializedTx || serializedTx.trim().length === 0) {
			return {
				isValid: false,
				error: "Empty or whitespace-only transaction data",
				details: "Input is empty, null, or contains only whitespace",
			};
		}

		const trimmed = serializedTx.trim();

		// Check if it's a JSON string containing an array (common format from frontend)
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) {
				console.log("Detected JSON array format");
				console.log("Array length:", parsed.length);
				console.log("First few elements:", parsed.slice(0, 10));

				// Validate array elements are valid bytes
				if (
					parsed.every(
						(item) => typeof item === "number" && item >= 0 && item <= 255
					)
				) {
					const buffer = Buffer.from(parsed);
					Transaction.from(buffer);
					return {
						isValid: true,
						format: "uint8array",
						details: `JSON array of ${parsed.length} bytes`,
					};
				} else {
					return {
						isValid: false,
						error: "JSON array contains invalid byte values",
						details: "Array elements must be numbers between 0-255",
					};
				}
			}
		} catch (jsonError) {
			console.log("Not JSON format:", jsonError);
		}

		const formats: Array<{
			name: "base58" | "hex" | "utf8" | "buffer" | "base64";
			decoder: (input: string) => Buffer;
			validator?: (input: string) => boolean;
		}> = [
			{
				name: "base58",
				decoder: (input) => Buffer.from(bs58.decode(input)),
				validator: (input) => {
					// Base58 uses specific character set and should be reasonable length
					const isValidChars = /^[1-9A-HJ-NP-Za-km-z]+$/.test(input);
					const isReasonableLength = input.length >= 10 && input.length <= 2000;
					return isValidChars && isReasonableLength;
				},
			},
			{
				name: "base64",
				decoder: (input) => Buffer.from(input, "base64"),
				validator: (input) => {
					// Base64 validation
					const isValidChars = /^[A-Za-z0-9+/]*={0,2}$/.test(input);
					const isValidLength = input.length % 4 === 0;
					return isValidChars && isValidLength && input.length > 0;
				},
			},
			{
				name: "hex",
				decoder: (input) => Buffer.from(input, "hex"),
				validator: (input) => {
					const isValidChars = /^[0-9a-fA-F]+$/.test(input);
					const isEvenLength = input.length % 2 === 0;
					const isReasonableLength = input.length >= 10 && input.length <= 4000;
					return isValidChars && isEvenLength && isReasonableLength;
				},
			},
			{
				name: "buffer",
				decoder: (input) => {
					// Try to parse as comma-separated numbers
					const numbers = input.split(",").map((n) => parseInt(n.trim()));
					if (numbers.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
						return Buffer.from(numbers);
					}
					throw new Error("Not comma-separated numbers");
				},
				validator: (input) => /^[\d,\s]+$/.test(input) && input.includes(","),
			},
			{
				name: "utf8",
				decoder: (input) => {
					// Be more careful with UTF-8 - ensure minimum length for transaction
					const buffer = Buffer.from(input, "utf-8");
					if (buffer.length < 32) {
						// Minimum reasonable transaction size
						throw new Error("Buffer too small for valid transaction");
					}
					return buffer;
				},
			},
		];

		const errors: string[] = [];

		for (const format of formats) {
			try {
				console.log(`Trying format: ${format.name}`);

				// Check validator if available
				if (format.validator && !format.validator(trimmed)) {
					console.log(`Format ${format.name} failed validation`);
					errors.push(`${format.name}: failed format validation`);
					continue;
				}

				const buffer = format.decoder(trimmed);
				console.log(
					`Buffer created for ${format.name}, length:`,
					buffer.length
				);

				// Additional buffer validation
				if (buffer.length < 32) {
					console.log(`Format ${format.name} buffer too small:`, buffer.length);
					errors.push(
						`${format.name}: buffer too small (${buffer.length} bytes)`
					);
					continue;
				}

				// Try to create a transaction from the buffer
				const tx = Transaction.from(buffer);
				console.log(
					`Successfully created transaction with ${format.name} format`
				);
				return {
					isValid: true,
					format: format.name,
					details: `Buffer length: ${buffer.length}`,
				};
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Unknown error";
				console.log(`Format ${format.name} failed:`, errorMsg);
				errors.push(`${format.name}: ${errorMsg}`);
				continue;
			}
		}

		return {
			isValid: false,
			error: "Unable to deserialize transaction with any supported format",
			details: errors.join("; "),
		};
	}

	static inspectTransactionData(serializedTx: string): string {
		const trimmed = serializedTx.trim();
		const analysis = [];

		analysis.push(`Length: ${trimmed.length}`);
		analysis.push(`Type: ${typeof trimmed}`);

		// Character analysis
		const hasBase58Chars = /[1-9A-HJ-NP-Za-km-z]/.test(trimmed);
		const hasHexChars = /[0-9a-fA-F]/.test(trimmed);
		const hasBase64Chars = /[A-Za-z0-9+/=]/.test(trimmed);
		const hasNumbers = /\d/.test(trimmed);
		const hasCommas = trimmed.includes(",");
		const hasSpaces = trimmed.includes(" ");
		const hasBrackets = trimmed.includes("[") && trimmed.includes("]");

		analysis.push(
			`Characters: base58=${hasBase58Chars}, hex=${hasHexChars}, base64=${hasBase64Chars}, numbers=${hasNumbers}, commas=${hasCommas}, spaces=${hasSpaces}, brackets=${hasBrackets}`
		);

		// Check if it looks like different formats
		if (hasBrackets && hasNumbers && hasCommas) {
			analysis.push("Looks like: JSON array");
		} else if (hasNumbers && hasCommas && !hasBase58Chars) {
			analysis.push("Looks like: comma-separated numbers");
		} else if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length % 2 === 0) {
			analysis.push("Looks like: hex string");
		} else if (
			/^[A-Za-z0-9+/]*={0,2}$/.test(trimmed) &&
			trimmed.length % 4 === 0
		) {
			analysis.push("Looks like: base64 string");
		} else if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
			analysis.push("Looks like: base58 string");
		} else {
			analysis.push("Looks like: unknown format");
		}

		return analysis.join("; ");
	}

	static validateSecretKey(secretKey: string): {
		isValid: boolean;
		format?: "base58" | "hex" | "uint8array" | "buffer";
		keyPair?: Keypair;
		error?: string;
		details?: string;
	} {
		console.log("Validating secret key format...");
		console.log("Secret key type:", typeof secretKey);
		console.log("Secret key length:", secretKey.length);
		console.log("First 20 chars:", secretKey.substring(0, 20));

		// Check for empty or whitespace-only input
		if (!secretKey || secretKey.trim().length === 0) {
			return {
				isValid: false,
				error: "Empty or whitespace-only secret key",
				details: "Secret key is empty, null, or contains only whitespace",
			};
		}

		const trimmed = secretKey.trim();

		// Check if it's a JSON string containing an array (common format from frontend)
		try {
			const parsed = JSON.parse(trimmed);
			if (Array.isArray(parsed)) {
				console.log("Detected JSON array format for secret key");
				console.log("Array length:", parsed.length);

				// Validate array elements are valid bytes and correct length for secret key
				if (
					parsed.length === 64 &&
					parsed.every(
						(item) => typeof item === "number" && item >= 0 && item <= 255
					)
				) {
					const keyPair = Keypair.fromSecretKey(Buffer.from(parsed));
					return {
						isValid: true,
						format: "uint8array",
						keyPair,
						details: `JSON array of ${parsed.length} bytes`,
					};
				} else {
					return {
						isValid: false,
						error: "JSON array secret key invalid",
						details: `Array must be 64 bytes, got ${parsed.length} bytes or invalid values`,
					};
				}
			}
		} catch (jsonError) {
			console.log("Secret key not JSON format:", jsonError);
		}

		const formats: Array<{
			name: "base58" | "hex" | "buffer";
			decoder: (input: string) => Keypair;
			validator?: (input: string) => boolean;
		}> = [
			{
				name: "base58",
				decoder: (input) => Keypair.fromSecretKey(bs58.decode(input)),
				validator: (input) => {
					// Base58 secret keys should be around 88 characters
					const isValidChars = /^[1-9A-HJ-NP-Za-km-z]+$/.test(input);
					const isReasonableLength = input.length >= 80 && input.length <= 100;
					return isValidChars && isReasonableLength;
				},
			},
			{
				name: "hex",
				decoder: (input) => {
					const buffer = Buffer.from(input, "hex");
					if (buffer.length !== 64) {
						throw new Error(
							`Hex secret key must be 64 bytes, got ${buffer.length}`
						);
					}
					return Keypair.fromSecretKey(buffer);
				},
				validator: (input) => {
					const isValidChars = /^[0-9a-fA-F]+$/.test(input);
					const isCorrectLength = input.length === 128; // 64 bytes * 2 hex chars
					return isValidChars && isCorrectLength;
				},
			},
			{
				name: "buffer",
				decoder: (input) => {
					const numbers = input.split(",").map((n) => parseInt(n.trim()));
					if (numbers.length !== 64) {
						throw new Error(
							`Comma-separated secret key must be 64 bytes, got ${numbers.length}`
						);
					}
					if (!numbers.every((n) => !isNaN(n) && n >= 0 && n <= 255)) {
						throw new Error(
							"Invalid byte values in comma-separated secret key"
						);
					}
					return Keypair.fromSecretKey(Buffer.from(numbers));
				},
				validator: (input) => {
					const hasValidPattern =
						/^[\d,\s]+$/.test(input) && input.includes(",");
					if (!hasValidPattern) return false;
					const numbers = input.split(",").map((n) => parseInt(n.trim()));
					return numbers.length === 64;
				},
			},
		];

		const errors: string[] = [];

		for (const format of formats) {
			try {
				console.log(`Trying secret key format: ${format.name}`);

				// Check validator if available
				if (format.validator && !format.validator(trimmed)) {
					console.log(`Secret key format ${format.name} failed validation`);
					errors.push(`${format.name}: failed format validation`);
					continue;
				}

				const keyPair = format.decoder(trimmed);
				console.log(`Successfully created keypair with ${format.name} format`);
				return {
					isValid: true,
					format: format.name,
					keyPair,
					details: `Public key: ${keyPair.publicKey.toString()}`,
				};
			} catch (error) {
				const errorMsg =
					error instanceof Error ? error.message : "Unknown error";
				console.log(`Secret key format ${format.name} failed:`, errorMsg);
				errors.push(`${format.name}: ${errorMsg}`);
				continue;
			}
		}

		return {
			isValid: false,
			error: "Unable to parse secret key with any supported format",
			details: errors.join("; "),
		};
	}

	static inspectSecretKeyData(secretKey: string): string {
		const trimmed = secretKey.trim();
		const analysis = [];

		analysis.push(`Length: ${trimmed.length}`);
		analysis.push(`Type: ${typeof trimmed}`);

		// Character analysis (safe for secret keys)
		const hasBase58Chars = /[1-9A-HJ-NP-Za-km-z]/.test(trimmed);
		const hasHexChars = /[0-9a-fA-F]/.test(trimmed);
		const hasNumbers = /\d/.test(trimmed);
		const hasCommas = trimmed.includes(",");
		const hasSpaces = trimmed.includes(" ");
		const hasBrackets = trimmed.includes("[") && trimmed.includes("]");

		analysis.push(
			`Characters: base58=${hasBase58Chars}, hex=${hasHexChars}, numbers=${hasNumbers}, commas=${hasCommas}, spaces=${hasSpaces}, brackets=${hasBrackets}`
		);

		// Check if it looks like different formats
		if (hasBrackets && hasNumbers && hasCommas) {
			analysis.push("Looks like: JSON array");
		} else if (hasNumbers && hasCommas && !hasBase58Chars) {
			analysis.push("Looks like: comma-separated numbers");
			const numbers = trimmed.split(",").map((n) => parseInt(n.trim()));
			analysis.push(`Array length: ${numbers.length}`);
		} else if (/^[0-9a-fA-F]+$/.test(trimmed)) {
			analysis.push("Looks like: hex string");
			analysis.push(
				`Hex length: ${trimmed.length} chars (${trimmed.length / 2} bytes)`
			);
		} else if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(trimmed)) {
			analysis.push("Looks like: base58 string");
		} else {
			analysis.push("Looks like: unknown format");
		}

		return analysis.join("; ");
	}

	async sendTransaction({ serializedTx, secretKey }: SendTransactionParams) {
		try {
			console.log("Preparing transaction...");
			console.log({
				serializedTx: serializedTx.substring(0, 50) + "...", // Log only first 50 chars for security
				secretKeyLength: secretKey.length,
				serializedTxType: typeof serializedTx,
				serializedTxLength: serializedTx.length,
			});

			// Ensure connection is established
			if (!this.connection) {
				this.connect();
			}

			// Validate inputs
			if (!serializedTx || !secretKey) {
				throw new Error(
					"Missing required parameters: serializedTx or secretKey"
				);
			}

			// Validate transaction format first
			const validation = Solana.validateSerializedTransaction(serializedTx);
			if (!validation.isValid) {
				console.error("Validation failed:", validation.details);
				const inspection = Solana.inspectTransactionData(serializedTx);
				console.error("Data inspection:", inspection);
				throw new Error(
					`${validation.error}. Details: ${validation.details}. Inspection: ${inspection}`
				);
			}

			console.log(
				`Transaction format detected: ${validation.format} (${validation.details})`
			);

			// Deserialize transaction using the detected format
			let tx: Transaction;
			switch (validation.format) {
				case "base58":
					tx = Transaction.from(bs58.decode(serializedTx));
					break;
				case "hex":
					tx = Transaction.from(Buffer.from(serializedTx, "hex"));
					break;
				case "base64":
					tx = Transaction.from(Buffer.from(serializedTx, "base64"));
					break;
				case "utf8":
					tx = Transaction.from(Buffer.from(serializedTx, "utf-8"));
					break;
				case "uint8array":
					const parsed = JSON.parse(serializedTx);
					tx = Transaction.from(Buffer.from(parsed));
					break;
				case "buffer":
					const numbers = serializedTx
						.split(",")
						.map((n) => parseInt(n.trim()));
					tx = Transaction.from(Buffer.from(numbers));
					break;
				default:
					throw new Error("Unsupported transaction format");
			}

			console.log("Transaction deserialized successfully");
			console.log("Signing transaction...");

			// Validate and decode secret key using enhanced validation
			const keyValidation = Solana.validateSecretKey(secretKey);
			if (!keyValidation.isValid || !keyValidation.keyPair) {
				console.error("Secret key validation failed:", keyValidation.details);
				const keyInspection = Solana.inspectSecretKeyData(secretKey);
				console.error("Secret key inspection:", keyInspection);
				throw new Error(
					`${keyValidation.error}. Details: ${keyValidation.details}. Inspection: ${keyInspection}`
				);
			}

			const keyPair = keyValidation.keyPair;
			console.log({
				publicKey: keyPair.publicKey.toString(),
				transactionSignatures: tx.signatures.length,
				secretKeyFormat: keyValidation.format,
			});

			const latestBlockhash =
				await this.connection?.getLatestBlockhash("finalized");
			if (!latestBlockhash) {
				throw new Error("Failed to get latest blockhash");
			}

			tx.recentBlockhash = latestBlockhash.blockhash;
			tx.feePayer = keyPair.publicKey;

			tx.sign(keyPair);

			const response = await this.connection?.sendTransaction(tx, [keyPair]);
			console.log("Transaction sent successfully:", response);
			return response;
		} catch (error) {
			console.error("Transaction submission failed:", error);
			throw new Error(
				`Failed to send transaction: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}
}

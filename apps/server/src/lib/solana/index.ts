import { Connection, Keypair, Transaction } from "@solana/web3.js";
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

	async sendTransaction({ serializedTx, secretKey }: SendTransactionParams) {
		try {
			const tx = Transaction.from(Buffer.from(serializedTx));

			const keyPair = Keypair.fromSecretKey(bs58.decode(secretKey));

			const latestBlockhash = await this.connection?.getLatestBlockhash();
			if (!latestBlockhash) {
				throw new Error("Failed to get latest blockhash");
			}

			tx.recentBlockhash = latestBlockhash.blockhash;
			tx.feePayer = keyPair.publicKey;

			tx.sign(keyPair);

			const response = await this.connection?.sendTransaction(tx, [keyPair]);
			return response;
		} catch (error) {
			throw new Error(
				`Failed to send transaction: ${error instanceof Error ? error.message : "Unknown error"}`
			);
		}
	}
}

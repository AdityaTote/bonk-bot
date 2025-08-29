import { Connection } from "@solana/web3.js";
import { create } from "zustand";
import { env } from "@/lib/env/env";

type ConnectionProps = {
	connection: Connection;

	setConnection: (connection: Connection) => void;
};

export const useConnection = create<ConnectionProps>()((set) => ({
	connection: new Connection(env.VITE_SOLANA_RPC_URL!),
	setConnection: (connection: Connection) => set({ connection }),
}));

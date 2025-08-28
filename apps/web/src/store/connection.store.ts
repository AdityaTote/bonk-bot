import { Connection } from "@solana/web3.js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { env } from "@/lib/env/env";

type ConnectionProps = {
	connection: Connection;

	setConnection: (connection: Connection) => void;
};

export const useConnection = create<ConnectionProps>()(
	persist(
		(set) => ({
			connection: new Connection(env.VITE_SOLANA_RPC_URL!),
			setConnection: (connection: Connection) => set({ connection }),
		}),
		{
			name: "connection-storage",
		}
	)
);

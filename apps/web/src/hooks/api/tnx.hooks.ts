import { api } from "@/lib/api/axios";
import { TnxSchema } from "@/lib/validator/transaction.validator";
import { useMutation } from "@tanstack/react-query";

export const useTransact = () => {
	return useMutation({
		mutationKey: ["transaction"],
		mutationFn: async (data: TnxSchema) => {
			const result = await api.tnx.createTransaction(data);
			if (!result.success) {
				// Throw error with message for react-query to catch
				throw new Error(result.message || "Transaction failed");
			}
			return result;
		},
	});
};

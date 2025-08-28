import { api } from "@/lib/api/axios"
import { TnxSchema } from "@/lib/validator/transaction.validator";
import { useMutation } from "@tanstack/react-query"

export const useTransact = () => {
  return useMutation({
		mutationKey: ["transaction"],
		mutationFn: async (data: TnxSchema) =>
			await api.tnx.createTransaction(data),
	});
}
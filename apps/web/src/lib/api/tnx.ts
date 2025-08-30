import { Axios } from "axios";
import { TnxSchema } from "../validator/transaction.validator";

export class Tnx {
	constructor(private readonly api: Axios) {}

	async createTransaction(data: TnxSchema) {
		try {
			const response = await this.api.post("/tnx/send", data);
			if (response.data && typeof response.data.success !== "undefined") {
				return response.data;
			}
			return {
				success: true,
				message: "Transaction submitted successfully!",
				data: response.data,
			};
		} catch (error: any) {
			return {
				success: false,
				message:
					error?.response?.data?.message ||
					error?.message ||
					"Transaction creation failed",
				data: null,
			};
		}
	}

	async getTransaction(id: string) {
		try {
			const response = await this.api.get(`/tnx/${id}`);
			return response.data;
		} catch (error: any) {
			return {
				success: false,
				message:
					error?.response?.data?.message ||
					error?.message ||
					"Transaction fetch failed",
				data: null,
			};
		}
	}
}

import { Axios } from "axios";
import { TnxSchema } from "../validator/transaction.validator";

export class Tnx {
	constructor(private readonly api: Axios) {}

	async createTransaction(data: TnxSchema) {
		const response = await this.api.post("/tnx", data);
		return response.data;
	}

	async getTransaction(id: string) {
		const response = await this.api.get(`/tnx/${id}`);
		return response.data;
	}
}

import { Axios } from "axios";
import { type AuthSchema } from "../validator/auth.validator";
import { IAuthResponse } from "@/types/response/auth-response";

export class Auth {
	constructor(private readonly api: Axios) {}

	async signup({ email, password }: AuthSchema): Promise<IAuthResponse> {
		const { data } = await this.api.post("/auth/signup", {
			email,
			password,
		});
		return data;
	}

	async signin({ email, password }: AuthSchema): Promise<IAuthResponse> {
		const { data } = await this.api.post("/auth/signin", {
			email,
			password,
		});
		return data;
	}
}

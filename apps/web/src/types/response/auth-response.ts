import { BaseApiResponse } from "./base-response";

export interface IAuthResponse
	extends BaseApiResponse<{
		user: {
			id: number;
			email: string;
			publicKey?: string;
		};
		token: string;
	}> {}

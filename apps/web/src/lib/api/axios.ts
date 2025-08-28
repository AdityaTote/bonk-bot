import axios, { type Axios } from "axios";
import { env } from "../env/env";
import { useAuthStore } from "@/store/auth.store";
import { Auth } from "./auth";
import { Tnx } from "./tnx";

class Api {
	private _api: Axios;

	// api endpoints
	auth: Auth;
	tnx: Tnx;

	constructor() {
		this._api = this.initAxios();

		// init apis
		this.auth = new Auth(this._api);
		this.tnx = new Tnx(this._api);
	}

	// initilaize axios
	private initAxios() {
		const axiosInstance = axios.create({
			baseURL: `${env.VITE_API_URL}/api/v1`,
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			adapter: "fetch",
			fetchOptions: { cache: "no-store" },
		});

		// add token to the authorization while making requests
		axiosInstance.interceptors.request.use(async (c) => {
			const user = useAuthStore.getState().user;
			if (user?.token) {
				c.headers.Authorization = `Bearer ${user.token}`;
			}
			return c;
		});

		return axiosInstance;
	}
}

export const api = new Api();

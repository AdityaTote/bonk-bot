import type { ResponseType } from "../responses/type";

export interface IServiceResponse<T = any> extends ResponseType<T> {
	error: boolean;
}

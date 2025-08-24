import type { ResponseType } from "../responses/type";

export interface IBaseApiResponse<T = any> extends ResponseType<T> {
	success: boolean;
	data: T | null;
}

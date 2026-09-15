export interface MessageResponse {
	message: string;
}

export interface DataResponse<T> {
	data: T;
}

export interface ListResponse<T> extends DataResponse<T> {
	currentPage: number;
	totalPage: number;
	totalData: number;
	shownData: number;
}

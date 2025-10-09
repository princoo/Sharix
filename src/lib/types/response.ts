import { PageInfo } from "./pagination";

export type ErrorResponse = {
  success: false;
  message: string;
};

export type SuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type PaginatedList<T> = {
  items: T[];
  pagination: PageInfo;
};
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

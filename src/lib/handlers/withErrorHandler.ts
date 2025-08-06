/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorResponse } from "../response";

type Handler = (
  req: Request,
  ctx: any
) => Promise<Response>;

export function withErrorHandler(handler: Handler) {
  return async function (req: Request, ctx: any) {
    try {
      return await handler(req, ctx);
    } catch (err: any) {
      const message = err.message || "Something went wrong";
      const status = err.status || 500;
      return errorResponse(message, status, {
        ...(err.details || {}),
      });
    }
  };
}

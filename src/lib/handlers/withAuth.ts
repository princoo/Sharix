/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorResponse } from "../response";
import { getServerSessionUSer } from "../services/auth";


type Handler = (
  req: Request,
  ctx?:any 
) => Promise<Response>;

export function withAuth(handler: Handler, allowedRoles: string[] = []) {
  return async function (req: Request, ctx: any) {
    const session = await getServerSessionUSer();

    if (!session) {
      return errorResponse("Unauthorized", 401);
    }

    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(session.role)
    ) {
      return errorResponse("Forbidden", 403);
    }

    return handler(req, { params: ctx.params, session });
  };
}

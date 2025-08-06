import { RolesEnum } from "@/enum/role";
import * as inviteController from "@/lib/controllers/invitesController";
import { withAuth } from "@/lib/handlers/withAuth";
import { withErrorHandler } from "@/lib/handlers/withErrorHandler";

export const POST = withErrorHandler(
  withAuth(inviteController.create, [RolesEnum.MANAGER])
);
export const GET = withErrorHandler(
  withAuth(inviteController.AllInvites, [RolesEnum.MANAGER])
);

import { withAuth } from "@/lib/handlers/withAuth";
import { withErrorHandler } from "@/lib/handlers/withErrorHandler";
import * as inviteController from "@/lib/controllers/invitesController";
import { RolesEnum } from "@/enum/role";

export const GET = withErrorHandler(
  withAuth(inviteController.AcceptedInvites, [RolesEnum.MANAGER])
);

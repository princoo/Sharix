import * as inviteController from "@/lib/controllers/invitesController";
import { withErrorHandler } from "@/lib/handlers/withErrorHandler";

export const POST = withErrorHandler(inviteController.confirmInvite);

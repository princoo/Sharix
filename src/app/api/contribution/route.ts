import { RolesEnum } from "@/enum/role";
import { withAuth } from "@/lib/handlers/withAuth";
import * as contributionController from "@/lib/controllers/contributionController";
import { withErrorHandler } from "@/lib/handlers/withErrorHandler";

export const POST = withErrorHandler(
  withAuth(contributionController.create, [
    RolesEnum.MANAGER,
    RolesEnum.BOARD,
    RolesEnum.MEMBER,
  ])
);

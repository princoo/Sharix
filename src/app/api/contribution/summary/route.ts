import { RolesEnum } from "@/enum/role";
import { withAuth } from "@/lib/handlers/withAuth";
import * as contributionController from "@/lib/controllers/contributionController";
import { withErrorHandler } from "@/lib/handlers/withErrorHandler";

export const GET = withErrorHandler(
  withAuth(contributionController.getSummary, [RolesEnum.MANAGER])
);

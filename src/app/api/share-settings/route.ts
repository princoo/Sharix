import { withAuth } from "@/lib/handlers/withAuth";
import { withErrorHandler } from "@/lib/handlers/withErrorHandler";
import * as shareSettingController from "@/lib/controllers/shareSettingController";
import { RolesEnum } from "@/enum/role";

export const POST = withErrorHandler(
  withAuth(shareSettingController.create, [RolesEnum.MANAGER])
);

export const GET = withErrorHandler(
  withAuth(shareSettingController.getCurrent)
);

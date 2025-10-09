import { withErrorHandler } from "@/lib/handlers/withErrorHandler";
import { loginController } from "@/lib/controllers/authController";

export const POST = withErrorHandler(loginController);

import { jsonResponse } from "../response";
import { loginSchema } from "../schemas/authSchema";
import { loginService } from "../services/auth";

export async function loginController(req: Request) {
  const body = await req.json();
  const data = loginSchema.parse(body);
  const result = await loginService(data);
  return jsonResponse(
    { ...result },
    {
      message: "Login successful",
      status: 201,
    }
  );
}

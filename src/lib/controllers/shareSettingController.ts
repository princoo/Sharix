import { errorResponse, jsonResponse } from "../response";
import {
  createShareSettingSchema,
  updateShareSettingSchema,
} from "../schemas/shareSettingSchema";
import {
  createShareSetting,
  getActiveSharePrice,
  updateShareSetting,
} from "../services/shareSettingService";

export const create = async (req: Request) => {
  const body = await req.json();
  const parsed = createShareSettingSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const setting = await createShareSetting({
    sharePrice: parseFloat(parsed.data.sharePrice),
    activeFrom: parsed.data.activeFrom,
  });
  return jsonResponse(setting, { status: 201 });
};

export const update = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateShareSettingSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.message, 400);

  const setting = await updateShareSetting(id, {
    ...(parsed.data.sharePrice && {
      sharePrice: parseFloat(parsed.data.sharePrice),
    }),
    ...(parsed.data.activeFrom && { activeFrom: parsed.data.activeFrom }),
  });
  return jsonResponse(setting);
};

export const getCurrent = async () => {
  const setting = await getActiveSharePrice();
  return jsonResponse(setting);
};

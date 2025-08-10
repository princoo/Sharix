import { User } from "next-auth";
import { errorResponse, jsonResponse } from "../response";
import {
  contributionSchema,
  contributionSummarySchema,
} from "../schemas/contributionSchema";
import { uploadToCloudinary } from "../utils/imageUpload";
import {
  approveContribution,
  createContribution,
  getContributionById,
  getContributionSummary,
  getMemberContributions,
} from "../services/contributionService";
import { PaymentStatusEnum } from "@/enum/paymentStatus";

export async function create(
  req: Request,
  { session }: { session: User & { role: string } }
) {
  const formData = await req.formData();
  const proof = formData.get("proof") as File | null;
  const month = formData.get("month") as string;
  const date = new Date(`${month}T00:00:00.000Z`);
  const amountPaid = formData.get("amountPaid") as string;
  const parsed = contributionSchema.safeParse({ month, amountPaid, proof });
  if (!parsed.success) {
    return errorResponse(parsed.error.message, 400);
  }
  let proofUrl: string | null = null;
  if (proof) {
    const arrayBuffer = await proof.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString("base64");
    const dataUri = `data:${proof.type};base64,${base64String}`;

    const uploadResult = await uploadToCloudinary(
      dataUri,
      `${session.email}-${Date.now()}`
    );

    if (uploadResult.success && uploadResult.result) {
      proofUrl = uploadResult.result.secure_url;
    } else {
      return errorResponse("Image upload failed", 500);
    }
  }

  const data = await createContribution({
    month: date,
    amountPaid,
    proofUrl: proofUrl !== null ? proofUrl : undefined,
    profileId: session.Profile.id,
  });
  return jsonResponse(data, {
    message: "Contribution proof submitted",
    status: 201,
  });
}

export async function approve(
  _req: Request,
  {
    params,
    session,
  }: { params: Promise<{ id: string }>; session: User & { role: string } }
) {
  const { id } = await params;
  const contribution = await getContributionById(id);
  if (contribution && contribution.status === PaymentStatusEnum.CONFIRMED) {
    return errorResponse("Contribution already approved", 400);
  }
  const data = await approveContribution(id, session.id!);
  return jsonResponse(data, { message: "Contribution approved", status: 200 });
}

export async function getSummary(req: Request) {
  const url = new URL(req.url);
  const month = url.searchParams.get("month");
  const parsed = contributionSummarySchema.safeParse({ month });

  if (!parsed.success) {
    return errorResponse("Month is required", 400);
  }
  const startDate = parsed.data.month; // already a Date object
  const endDate = new Date(startDate);
  endDate.setMonth(startDate.getMonth() + 1);

  const summary = await getContributionSummary(startDate, endDate);

  return jsonResponse(summary, { message: "Contribution summary fetched" });
}

export const myContributions = async (
  _req: Request,
  { session }: { session: User & { role: string } }
) => {
    const contributions = await getMemberContributions(session.Profile.id);
    return jsonResponse(contributions, {
      message: "My contributions fetched",
      status: 200,
    });

};

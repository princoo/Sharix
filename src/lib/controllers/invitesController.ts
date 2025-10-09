import { errorResponse, jsonResponse } from "../response";
import { getUserByEmail } from "../services/userService";
import {
  acceptInvite,
  createInvite,
  getAcceptedInvites,
  getAllInvites,
  getInviteByToken,
  getPendingInvites,
  getUserInvite,
} from "../services/invitesService";
import { User } from "next-auth";
import { sendMail } from "../sendMail";
import { invitesSchema } from "../schemas/inviteSchema";
import { verifyInviteToken } from "../utils/invite";
import { memberProfileSchema } from "../schemas/profileSchema";
import bcrypt from "bcryptjs";

export async function create(
  request: Request,
  { session }: { session: User & { role: string } },
) {
  const { email, role } = await request.json();
  const parsed = invitesSchema.safeParse({ email, role });
  if (!parsed.success) {
    return errorResponse(parsed.error.message, 400);
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    const pendingInvite = await getUserInvite(existingUser.id);
    if (pendingInvite) {
      return errorResponse("The user already has a pending invite", 400);
    } else {
      return errorResponse("The user is already registered", 400);
    }
  }
  const { user, invite } = await createInvite(email, role, session.id!);

  await sendMail({
    email,
    subject: "Invitation to Sharix",
    text: `You have been invited to Sharix. Please click the link below to accept the invitation: https://sharix.vercel.app/accept-invite?token=${invite.token}`,
  });

  return jsonResponse(
    { user, invite },
    { message: "Invitation sent", status: 201 },
  );
}

export async function AllInvites() {
  const invites = await getAllInvites();
  return jsonResponse(invites, {
    message: "All Invites retrieved",
    status: 200,
  });
}

export async function PendingInvites() {
  const invites = await getPendingInvites();
  return jsonResponse(invites, {
    message: "Pending Invites retrieved",
    status: 200,
  });
}
export async function AcceptedInvites() {
  const invites = await getAcceptedInvites();
  return jsonResponse(invites, {
    message: "Accepted Invites retrieved",
    status: 200,
  });
}

export async function confirmInvite(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const data = await request.json();

  const parsed = memberProfileSchema.safeParse(data);
  if (!parsed.success) {
    return errorResponse(parsed.error.message, 400);
  }
  const password = await bcrypt.hash(
    parsed.data.password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
  );
  verifyInviteToken(token);
  const invite = await getInviteByToken(token);
  if (!invite || invite.expiresAt < new Date() || invite.acceptedAt) {
    return errorResponse("Invalid or expired token", 400);
  }

  const newProfile = await acceptInvite(invite.userId, token, {
    ...parsed.data,
    password,
  });
  return jsonResponse(newProfile, { message: "Invite accepted", status: 200 });
}

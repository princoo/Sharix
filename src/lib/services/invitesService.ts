import { prisma } from "../db";
import { MemberProfileData } from "../schemas/profileSchema";
import { generateInviteToken } from "../utils/invite";

export async function getAllInvites() {
  return prisma.invite.findMany();
}
export async function getUserInvite(id: string) {
  return prisma.invite.findFirst({
    where: {
      userId: id,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function getInviteByToken(token: string) {
  return prisma.invite.findFirst({
    where: {
      token,
    },
  });
}
export async function getPendingInvites() {
  return prisma.invite.findMany({ where: { acceptedAt: null } });
}
export async function getAcceptedInvites() {
  return prisma.invite.findMany({ where: { acceptedAt: { not: null } } });
}

export async function createInvite(
  email: string,
  role: string,
  userInviting: string
) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        roleId: role,
        invitedBy: userInviting,
      },
    });

    const token = generateInviteToken(user.id);
    const invite = await tx.invite.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { user, invite };
  });
}
export async function acceptInvite(
  userId: string,
  token: string,
  data: MemberProfileData
) {
  const { password, ...rest } = data;
  const result =  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { isActive: true, password },
    });
    const profile = await tx.memberProfile.create({
      data: { ...rest, joinDate: new Date(), userId },
    });
    await tx.invite.update({
      where: { token },
      data: { acceptedAt: new Date() },
    });
    return profile
  });
  return result
}

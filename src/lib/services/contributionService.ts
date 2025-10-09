import { ContributionData } from "@/lib/types/contribution";
import { prisma } from "../db";
import { getActiveSharePrice } from "./shareSettingService";

export async function createContribution(data: ContributionData) {
  const result = await prisma.contribution.create({
    data: { ...data },
  });

  return result;
}

export async function approveContribution(
  recordId: string,
  approverId: string,
) {
  const data = await prisma.contribution.update({
    where: { id: recordId },
    data: { confirmedBy: approverId, status: "confirmed" },
  });
  return data;
}

export async function getContributionById(id: string) {
  const data = await prisma.contribution.findUnique({ where: { id } });
  return data;
}

export async function getContributionSummary(startDate: Date, endDate: Date) {
  const members = await prisma.memberProfile.findMany({
    include: {
      contributions: {
        where: {
          month: {
            gte: startDate,
            lt: endDate,
          },
          status: "confirmed",
        },
      },
      user: {
        select: { email: true },
      },
    },
  });
  const sharePrice = await getActiveSharePrice();

  return members.map((member) => {
    const totalPaid = member.contributions.reduce(
      (sum, c) => sum + Number(c.amountPaid),
      0,
    );

    const singleSharePrice = Number(sharePrice?.sharePrice) || 0;
    const requiredAmount =
      Number(member.monthlyShareCommitment) * singleSharePrice;

    const remainingAmount = Math.max(requiredAmount - totalPaid, 0);

    let status = "Pending";
    if (totalPaid >= requiredAmount) {
      status = "Complete";
    } else if (totalPaid > 0) {
      status = "Partial";
    }

    return {
      memberId: member.id,
      email: member.user.email,
      totalPaid,
      sharePrice: singleSharePrice,
      commitmentShares: member.monthlyShareCommitment,
      requiredAmount,
      remainingAmount,
      status,
    };
  });
}

export const getMemberContributions = async (profileId: string) => {
  const contributions = await prisma.contribution.findMany({
    where: { profileId },
    orderBy: { month: "desc" },
  });

  return contributions;
};

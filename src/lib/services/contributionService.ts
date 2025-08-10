import { ContributionData } from "@/types/contribution";
import { prisma } from "../db";

export async function createContribution(data: ContributionData) {
  const result = await prisma.contribution.create({
    data: { ...data },
  });

  return result;
}

export async function approveContribution(
  recordId: string,
  approverId: string
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

  return members.map((member) => {
    const totalPaid = member.contributions.reduce(
      (sum, c) => sum + Number(c.amountPaid),
      0
    );

    const requiredAmount = Number(member.monthlyShareCommitment) * 10000; // assumming a single share is 10,000
    let status = "Pending";
    if (totalPaid >= requiredAmount) {
      // if (totalPaid >= Number(member.monthlyShareCommitment)) {
      status = "Complete";
    } else if (totalPaid > 0) {
      status = "Partial";
    }

    // return {startDate,endDate}
    return {
      memberId: member.id,
      // name: member.user.name,
      email: member.user.email,
      totalPaid,
      commitment: member.monthlyShareCommitment,
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

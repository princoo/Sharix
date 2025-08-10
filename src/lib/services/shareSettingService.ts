import { prisma } from "@/lib/db";

export const createShareSetting = async (data: { sharePrice: number; activeFrom: Date }) => {
  return prisma.shareSetting.create({
    data: {
      sharePrice: data.sharePrice,
      activeFrom: data.activeFrom
    }
  });
};

export const updateShareSetting = async (id: string, data: Partial<{ sharePrice: number; activeFrom: Date }>) => {
  return prisma.shareSetting.update({
    where: { id },
    data
  });
};

export const getActiveSharePrice = async () => {
  return prisma.shareSetting.findFirst({
    where: {
      activeFrom: { lte: new Date() }
    },
    orderBy: { activeFrom: "desc" }
  });
};

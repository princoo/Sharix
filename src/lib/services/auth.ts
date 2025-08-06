import { auth } from "../../../auth";

export const getServerSessionUSer = async () => {
  const session = await auth();
  return session?.user;
};

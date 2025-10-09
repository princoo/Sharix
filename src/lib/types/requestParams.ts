import { MemberProfileData } from "../schemas/profileSchema";

export interface SetUpPasswordParams {
  token: string;
  userData: MemberProfileData;
}

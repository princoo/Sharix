export interface UserProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  monthlyShareCommitment: number;
  phoneNumber: string | null;
  joinDate: Date;
}

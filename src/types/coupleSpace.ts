import type { Tables } from "@/types/database";

export type CoupleSpace = Tables<"couple_spaces">;
export type CoupleMember = Tables<"couple_members">;
export type CoupleInvitation = Tables<"couple_invitations">;

export interface CreateCoupleSpaceFormValues {
  name: string;
}

export interface JoinCoupleSpaceFormValues {
  code: string;
}

export type UpdateCoupleSpaceFormValues = CreateCoupleSpaceFormValues;

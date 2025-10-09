import { baseApi } from "@/lib/base-api";
import { SetUpPasswordParams } from "@/lib/types/requestParams";
import { ApiResponse } from "@/lib/types/response";
import { UserProfile } from "@/lib/types/user";

export const authMutationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setupPassword: builder.mutation<
      ApiResponse<UserProfile>,
      SetUpPasswordParams
    >({
      query: ({ token, userData }) => ({
        url: `/invites/confirm/${token}`,
        method: "POST",
        body: { ...userData },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSetupPasswordMutation } = authMutationsApi;

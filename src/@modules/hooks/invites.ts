import { useRecoilValue } from "recoil";

import { getMyInvites } from "../api/invites";
import { authStore } from "../stores/auth";
import { JoinedWorkspace } from "../types/workspaces";
import { useSWR } from "../utils/cache.react";

export function useMyInvites() {
  const { user } = useRecoilValue(authStore);

  const {
    loading: workspaceInvitesLoading,
    value: workspaceInvites,
    revalidate: revalidateWorkspaceInvites,
  } = useSWR<JoinedWorkspace[]>(`invites/${user?.uid}}`, () => getMyInvites());

  return {
    workspaceInvitesLoading,
    workspaceInvites,
    revalidateWorkspaceInvites,
  };
}

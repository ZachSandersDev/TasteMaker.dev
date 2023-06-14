import { useRecoilValue } from "recoil";

import {
  getJoinedWorkspaces,
  getMyWorkspaces,
  getWorkspace,
} from "../api/workspaces";
import { authStore } from "../stores/auth";
import { JoinedWorkspace, Workspace } from "../types/workspaces";
import { useSWR } from "../utils/cache.react";

export function useAllWorkspaces() {
  const { user } = useRecoilValue(authStore);

  const { loading: myWorkspacesLoading, value: myWorkspaces } = useSWR<
    Workspace[]
  >(`${user?.uid}/workspaces`, () => getMyWorkspaces());

  const { loading: joinedWorkspaceIdsLoading, value: joinedWorkspaceIds } =
    useSWR<JoinedWorkspace[]>(`${user?.uid}/joinedWorkspaceIds`, () =>
      getJoinedWorkspaces()
    );

  const { loading: joinedWorkspacesLoading, value: joinedWorkspaces } = useSWR<
    Workspace[]
  >(
    `${user?.uid}/${JSON.stringify(joinedWorkspaceIds)}/joinedWorkspaces`,
    () => {
      if (!joinedWorkspaceIds) return Promise.resolve([]);

      return Promise.all(
        joinedWorkspaceIds.map((params) => getWorkspace(params))
      ).then((workspaces) => workspaces.filter((w): w is Workspace => !!w));
    }
  );

  return {
    workspaces: [
      ...(myWorkspaces || []).map((ws) => ({
        uid: user?.uid,
        ws,
      })),
      ...(joinedWorkspaces || []).map((ws) => {
        const joinedWorkspaceParams = joinedWorkspaceIds?.find(
          (jws) => jws.workspaceId === ws._id
        );

        return {
          uid: joinedWorkspaceParams?.userId,
          ws,
        };
      }),
    ],
    loading:
      myWorkspacesLoading ||
      joinedWorkspaceIdsLoading ||
      joinedWorkspacesLoading,
  };
}

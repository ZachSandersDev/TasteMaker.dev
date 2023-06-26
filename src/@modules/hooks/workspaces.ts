import { useRecoilValue } from "recoil";

import {
  getJoinedWorkspaces,
  getMyWorkspaces,
  getWorkspace,
} from "../api/workspaces";
import { authStore } from "../stores/auth";
import { JoinedWorkspace, Workspace } from "../types/workspaces";
import { useSWR } from "../utils/cache.react";

import { useMyInvites } from "./invites";

export interface WorkspaceInvitePair {
  userId?: string;
  workspaceId?: string;
  inviteId?: string;
  ws: Workspace;
}

export interface WorkspaceFetchState {
  workspaces: WorkspaceInvitePair[];
  loading: boolean;
  revalidate: () => void;
}

export function useAllWorkspaces(): WorkspaceFetchState {
  const { user } = useRecoilValue(authStore);

  const {
    loading: myWorkspacesLoading,
    value: myWorkspaces,
    revalidate: revalidateMyWorkspaces,
  } = useSWR<Workspace[]>(`${user?.uid}/workspaces`, () => getMyWorkspaces());

  const {
    loading: joinedWorkspaceIdsLoading,
    value: joinedWorkspaceIds,
    revalidate: revalidateJoinedWorkspaceIds,
  } = useSWR<JoinedWorkspace[]>(`${user?.uid}/joinedWorkspaceIds`, () =>
    getJoinedWorkspaces()
  );

  const {
    loading: joinedWorkspacesLoading,
    value: joinedWorkspaces,
    revalidate: revalidateJoinedWorkspaces,
  } = useSWR<Workspace[]>(
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
        userId: user?.uid,
        workspaceId: ws._id,
        ws,
      })),
      ...(joinedWorkspaces || []).map((ws) => {
        const joinedWorkspaceParams = joinedWorkspaceIds?.find(
          (jws) => jws.workspaceId === ws._id
        );

        return {
          userId: joinedWorkspaceParams?.userId,
          workspaceId: joinedWorkspaceParams?.workspaceId,
          inviteId: joinedWorkspaceParams?._id,
          ws,
        };
      }),
    ],
    loading:
      myWorkspacesLoading ||
      joinedWorkspaceIdsLoading ||
      joinedWorkspacesLoading,
    revalidate: () => {
      revalidateMyWorkspaces();
      revalidateJoinedWorkspaceIds();
      revalidateJoinedWorkspaces();
    },
  };
}

export function useInvitedWorkspaces(): WorkspaceFetchState {
  const { user } = useRecoilValue(authStore);

  const {
    workspaceInvitesLoading,
    workspaceInvites,
    revalidateWorkspaceInvites,
  } = useMyInvites();

  const {
    loading: joinedWorkspacesLoading,
    value: joinedWorkspaces,
    revalidate,
  } = useSWR<Workspace[]>(
    `invited_workspaces/${user?.uid}/${workspaceInvites?.join(",")}`,
    () => {
      if (!workspaceInvites) return Promise.resolve([]);

      return Promise.all(
        workspaceInvites.map((params) => getWorkspace(params))
      ).then((workspaces) => workspaces.filter((w): w is Workspace => !!w));
    }
  );

  return {
    workspaces: [
      ...(joinedWorkspaces || []).map((ws) => {
        const joinedWorkspaceParams = workspaceInvites?.find(
          (jws) => jws.workspaceId === ws._id
        );

        return {
          userId: joinedWorkspaceParams?.userId,
          workspaceId: joinedWorkspaceParams?.workspaceId,
          inviteId: joinedWorkspaceParams?._id,
          ws,
        };
      }),
    ],
    loading: workspaceInvitesLoading || joinedWorkspacesLoading,
    revalidate: () => {
      revalidateWorkspaceInvites();
      revalidate();
    },
  };
}

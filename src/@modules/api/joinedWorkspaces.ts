import { child, ref, getDatabase, onValue, push } from "firebase/database";

import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { JoinedWorkspace } from "../types/workspaces";

import { app } from "./firebase";
import { formatSnapList } from "./utils";
import { formatJoinedWorkspace } from "./workspaces";

function getInvitesRef(userId?: string) {
  let currentRef = ref(getDatabase(app));

  if (userId) {
    currentRef = child(currentRef, `invites/${userId}`);
  } else {
    const { user } = getRecoil(authStore);
    if (!user) throw "User is not logged in";

    currentRef = child(currentRef, `invites/${user.uid}`);
  }

  return currentRef;
}

export function getMyInvites(): Promise<JoinedWorkspace[] | undefined> {
  return new Promise((resolve) => {
    onValue(
      getInvitesRef(),
      (snapshot) => {
        resolve(formatSnapList(snapshot, formatJoinedWorkspace));
      },
      { onlyOnce: true }
    );
  });
}

export const sendInvite = (userId: string, workspaceId: string) => {
  const { user } = getRecoil(authStore);
  if (!user) throw "User is not logged in";

  const jw: JoinedWorkspace = {
    _id: "",
    userId: user.uid,
    workspaceId,
  };

  return push(getInvitesRef(userId), jw);
};

import { useEffect } from "react";

import { useRecoilValue } from "recoil";

import { setEmailMap } from "../../@modules/api/emailMap";
import { authStore, listenForAuth } from "../../@modules/stores/auth";

export function AuthListener() {
  const { user } = useRecoilValue(authStore);

  useEffect(() => {
    return listenForAuth();
  }, []);

  useEffect(() => {
    if (user && user.email) {
      setEmailMap(user.uid, user.email);
    }
  }, [user]);

  return null;
}

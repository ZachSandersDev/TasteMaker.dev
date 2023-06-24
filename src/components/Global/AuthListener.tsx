import { useEffect } from "react";

import { listenForAuth } from "../../@modules/stores/auth";

export function AuthListener() {
  useEffect(() => {
    return listenForAuth();
  }, []);

  return null;
}

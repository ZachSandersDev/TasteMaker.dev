import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import router from "../@modules/router";
import { authStore, listenForAuth } from "../@modules/stores/auth";

export default function Shell() {
  const user = useRecoilValue(authStore);

  useEffect(() => {
    listenForAuth();
  }, []);

  return user ? (
    <main>
      <RouterProvider router={router} />
    </main>
  ) : (
    <span>Loading...</span>
  );
}

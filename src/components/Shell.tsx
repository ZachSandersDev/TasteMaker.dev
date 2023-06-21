import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import router from "../@modules/router";
import { authStore, listenForAuth } from "../@modules/stores/auth";

import Loading from "./Loading";

import "./Shell.scss";

export default function Shell() {
  const { loading: userLoading, user } = useRecoilValue(authStore);

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    if (!userLoading && !user && !location.pathname.includes("/public/")) {
      router.navigate("/login");
    }
  }, [userLoading, user]);

  if (!user && userLoading) {
    return <Loading />;
  }

  return (
    <main className="root-layout">
      <RouterProvider router={router} />
    </main>
  );
}

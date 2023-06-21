import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authStore, listenForAuth } from "../@modules/stores/auth";

import AppNav from "./AppNav";
import Loading from "./Loading";

import "./Shell.scss";

export default function Shell() {
  const { loading: userLoading, user } = useRecoilValue(authStore);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    const { pathname } = location;
    if (
      !userLoading &&
      !user &&
      !pathname.includes("/public/") &&
      !pathname.includes("/login")
    ) {
      navigate("/login");
    }
  }, [userLoading, user, location]);

  if (userLoading) {
    return <Loading />;
  }

  return (
    <main className="root-layout">
      <Outlet />
      <AppNav />
    </main>
  );
}

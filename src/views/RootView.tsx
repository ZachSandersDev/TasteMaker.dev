import { Outlet } from "react-router-dom";

import AppNav from "../components/AppNav";

import "./RootView.scss";

export default function RootView() {
  return (
    <main className="root-layout">
      <Outlet />
      <AppNav />
    </main>
  );
}

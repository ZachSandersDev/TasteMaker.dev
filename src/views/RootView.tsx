import { Outlet } from "react-router-dom";
import AppNav from "../components/AppNav";

export default function RootView() {
  return <>
    <Outlet />
    <AppNav />
  </>
}

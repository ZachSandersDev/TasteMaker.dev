import { Link, NavLink, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { navStore } from "../@modules/stores/nav";
import classNames from "../@modules/utils/classNames";

import "./AppNav.scss";

export default function AppNav() {
  const { pathname } = useLocation();
  const { bottomShadow } = useRecoilValue(navStore);

  return (
    <nav className={classNames("app-nav", bottomShadow && "shadow")}>
      <h1 className="ra-title">Easy Pea</h1>

      <Link
        to="/"
        className={[
          "app-link",
          (pathname.startsWith("/folder") ||
            pathname.startsWith("/recipe") ||
            pathname === "/") &&
            "active",
        ]
          .filter((s) => !!s)
          .join(" ")}
      >
        <i className="material-symbols-rounded">description</i>
        Recipes
      </Link>
      <Link
        to="/shopping-lists"
        className={[
          "app-link",
          (pathname.startsWith("/shopping-list/") ||
            pathname === "/shopping-lists") &&
            "active",
        ]
          .filter((s) => !!s)
          .join(" ")}
      >
        <i className="material-symbols-rounded">checklist</i>
        Shopping
      </Link>
      <NavLink to="/settings" className="app-link">
        <i className="material-symbols-rounded">settings</i>
        Settings
      </NavLink>
    </nav>
  );
}

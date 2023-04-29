import { Link, NavLink, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { navStore } from "../@modules/stores/nav";
import classNames from "../@modules/utils/classNames";
import useMediaQuery from "../@modules/utils/useMediaQuery";

import "./AppNav.scss";

export default function AppNav() {
  const { pathname } = useLocation();
  const { bottomShadow } = useRecoilValue(navStore);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  return (
    <nav className={classNames("app-nav", bottomShadow && "shadow")}>
      {!isMobile && (
        <div className="ra-card-header">
          <div className="app-title">Easy Pea</div>
        </div>
      )}

      <Link
        to="/"
        className={classNames(
          "app-link",
          (pathname.startsWith("/folder") ||
            pathname.startsWith("/recipe") ||
            pathname === "/") &&
            "active"
        )}
      >
        <i className="material-symbols-rounded">description</i>
        Recipes
      </Link>

      <Link
        to="/shopping-lists"
        className={classNames(
          "app-link",
          (pathname.startsWith("/shopping-list/") ||
            pathname === "/shopping-lists") &&
            "active"
        )}
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

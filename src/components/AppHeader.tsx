import { PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";

import { navStore } from "../@modules/stores/nav";
import classNames from "../@modules/utils/classNames";

import "./AppHeader.scss";

export interface AppHeaderProps {
  subView?: boolean;
}

export default function AppHeader({
  children,
  subView,
}: PropsWithChildren<AppHeaderProps>) {
  const navigate = useNavigate();
  const { topShadow } = useRecoilValue(navStore);

  return (
    <header className={classNames("app-header", topShadow && "shadow")}>
      <div className="app-header-content">
        {subView && (
          <button
            className="material-symbols-rounded icon-button"
            onClick={() => navigate(-1)}
          >
            chevron_left
          </button>
        )}
        {children}
      </div>
    </header>
  );
}

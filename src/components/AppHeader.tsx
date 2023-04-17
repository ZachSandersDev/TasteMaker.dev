import { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";

import { navStore } from "../@modules/stores/nav";
import classNames from "../@modules/utils/classNames";

import "./AppHeader.scss";

export interface AppHeaderProps {
  subView?: boolean;
  before?: ReactNode;
}

export default function AppHeader({
  children,
  subView,
  before,
}: PropsWithChildren<AppHeaderProps>) {
  const navigate = useNavigate();
  const { topShadow } = useRecoilValue(navStore);

  return (
    <header className={classNames("app-header", topShadow && "shadow")}>
      <div className="app-header-content">
        {before}
        {!before && subView && (
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

import { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";

import { navStore } from "../@modules/stores/nav";
import classNames from "../@modules/utils/classNames";

import "./AppHeader.scss";

export interface AppHeaderProps {
  subView?: boolean;
  before?: ReactNode;
  height?: string;
}

export default function AppHeader({
  children,
  subView,
  before,
  height,
}: PropsWithChildren<AppHeaderProps>) {
  const navigate = useNavigate();
  const { topShadow } = useRecoilValue(navStore);

  return (
    <header
      className={classNames("app-header", topShadow && "shadow")}
      style={{ height: height }}
    >
      <div className="app-header-content">
        {before}
        {!before && subView && (
          <Button onClick={() => navigate(-1)} variant="icon" size="xm">
            arrow_back_ios_new
          </Button>
        )}
        {children}
      </div>
    </header>
  );
}

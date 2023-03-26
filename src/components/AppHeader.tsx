import { PropsWithChildren } from "react";
import { useNavigate } from "react-router";

import "./AppHeader.scss";

export interface AppHeaderProps {
  subView?: boolean;
}

export default function AppHeader({
  children,
  subView,
}: PropsWithChildren<AppHeaderProps>) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      {subView && (
        <button className="icon-button" onClick={() => navigate(-1)}>
          <span className="back-button material-symbols-rounded">
            arrow_back
          </span>
        </button>
      )}
      {children}
    </header>
  );
}

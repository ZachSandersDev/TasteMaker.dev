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
      <div className="blocker"></div>

      {subView && (
        <button
          className="icon-button material-symbols-rounded"
          onClick={() => navigate(-1)}
        >
          arrow_back
        </button>
      )}
      {children}
    </header>
  );
}

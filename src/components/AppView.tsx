import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import { getRecoil, setRecoil } from "recoil-nexus";

import { navStore } from "../@modules/stores/nav";
import classNames from "../@modules/utils/classNames";

import "./AppView.scss";

export interface AppViewProps {
  header?: ReactElement;
  className?: string;
}

export default function AppView({
  header,
  children,
  className,
}: PropsWithChildren<AppViewProps>) {
  const topObserver = useRef<HTMLDivElement>(null);
  const bottomObserver = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const newState = structuredClone(getRecoil(navStore));
      for (const entry of entries) {
        if (entry.target === topObserver.current) {
          newState.topShadow = !entry.isIntersecting;
        }
        if (entry.target === bottomObserver.current) {
          newState.bottomShadow = !entry.isIntersecting;
        }
      }

      setRecoil(navStore, newState);
    });

    if (topObserver.current && bottomObserver.current) {
      observer.observe(topObserver.current);
      observer.observe(bottomObserver.current);
    }

    return () => observer.disconnect();
  }, [topObserver, bottomObserver]);

  useEffect(() => {
    return () => {
      setRecoil(navStore, { topShadow: false, bottomShadow: false });
    };
  }, []);

  return (
    <div className={classNames("ra-view", className)}>
      {header}
      <div className="ra-view-content">
        <div className="top-observer" ref={topObserver}></div>
        {children}
        <div className="bottom-observer" ref={bottomObserver}></div>
      </div>
    </div>
  );
}

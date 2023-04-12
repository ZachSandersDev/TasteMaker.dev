import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";
import { getRecoil, setRecoil } from "recoil-nexus";

import { navStore } from "../@modules/stores/nav";

import "./AppView.scss";

export default function AppView({
  header,
  children,
}: PropsWithChildren<{ header?: ReactElement }>) {
  const topObserver = useRef<HTMLDivElement>(null);
  const bottomObserver = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const newState = structuredClone(getRecoil(navStore));
      for (const entry of entries) {
        if (entry.target === topObserver.current) {
          newState.topShadow = !entry.isIntersecting;
          console.log("Top observer is", entry.isIntersecting);
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
    <div className="ra-view">
      {header}
      <div className="ra-view-content">
        <div className="top-observer" ref={topObserver}></div>
        {children}
        <div className="bottom-observer" ref={bottomObserver}></div>
      </div>
    </div>
  );
}

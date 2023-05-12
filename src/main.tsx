import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";

import Shell from "./components/Shell";
import "./@design/@EPDesign.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <Shell />
    </RecoilRoot>
  </React.StrictMode>
);

if (typeof navigator.serviceWorker !== "undefined") {
  navigator.serviceWorker.register("/sw.js");
}

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";

import router from "./@modules/router";

import "./@design/@EPDesign.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>
);

if (typeof navigator.serviceWorker !== "undefined") {
  navigator.serviceWorker.register("/sw.js");
}

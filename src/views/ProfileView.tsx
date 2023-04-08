import AppHeader from "../components/AppHeader";

import { doLogout } from "../@modules/stores/auth";

import "./ProfileView.scss";

export default function ProfileView() {
  return (
    <div className="ra-view">
      <AppHeader>
        {/* 
        <div className="ra-actions">
          <button className="icon-button material-symbols-rounded" onClick={makeNewFolder}>
            create_new_folder
          </button>
          <button className="icon-button material-symbols-rounded" onClick={makeNewRecipe}>
            add
          </button>
        </div>
      */}
      </AppHeader>

      <h2 className="ra-title">Profile</h2>

      <button
        className="menu-button"
        style={{ color: "var(--color-danger)" }}
        onClick={doLogout}
      >Log out</button>
    </div>
  );
}

import { doLogout } from "../@modules/stores/auth";

import "./ProfileView.scss";

export default function ProfileView() {
  return (
    <div className="ra-view">
      {/* <AppHeader/> */}
      <div className="ra-view-content">
        <h2 className="ra-title">Profile</h2>

        <button
          className="menu-button"
          style={{ color: "var(--color-danger)" }}
          onClick={doLogout}
        >Log out</button>
      </div>
    </div>
  );
}

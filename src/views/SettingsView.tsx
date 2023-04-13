import { doLogout } from "../@modules/stores/auth";
import AppView from "../components/AppView";

import "./SettingsView.scss";

export default function SettingsView() {
  return (
    <AppView>
      <h2 className="ra-title">Settings</h2>

      <button
        className="menu-button"
        style={{ color: "var(--color-danger)" }}
        onClick={doLogout}
      >
        Log out
      </button>
    </AppView>
  );
}

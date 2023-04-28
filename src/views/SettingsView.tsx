import { doLogout } from "../@modules/stores/auth";
import AppView from "../components/AppView";

import "./SettingsView.scss";

export default function SettingsView() {
  return (
    <AppView>
      <div className="ra-view-header">
        <h2 className="ra-title">Settings</h2>
      </div>

      <button
        className="settings-option"
        style={{ color: "var(--color-danger)" }}
        onClick={doLogout}
      >
        Log out
      </button>
    </AppView>
  );
}

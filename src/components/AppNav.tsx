import { NavLink } from "react-router-dom";

import "./AppNav.scss";

export default function AppNav() {
  return (
    <nav className="app-nav">
      <NavLink to="/" className="app-link">
        <i className="material-symbols-rounded">description</i>
        Recipes
      </NavLink>
      <NavLink to="/shopping-lists" className="app-link">
        <i className="material-symbols-rounded">checklist</i>
        Shopping
      </NavLink>
      <NavLink to="/profile" className="app-link">
        <i className="material-symbols-rounded">account_circle</i>
        Me
      </NavLink>
    </nav>
  );
}

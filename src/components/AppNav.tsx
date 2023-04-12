import { Link, NavLink, useLocation } from "react-router-dom";

import "./AppNav.scss";

export default function AppNav() {
  const {pathname} = useLocation();

  return (
    <nav className="app-nav">
      <Link to="/" className={["app-link", 
        (pathname.startsWith("/folder") || pathname.startsWith("/recipe") || pathname === "/") && "active" 
      ].filter(s => !!s).join(" ")}
      >
        <i className="material-symbols-rounded">description</i>
        Recipes
      </Link>
      <Link to="/shopping-lists" 
        className={["app-link", 
          (pathname.startsWith("/shopping-list/") || pathname === "/shopping-lists") && "active" 
        ].filter(s => !!s).join(" ")}
      >
        <i className="material-symbols-rounded">checklist</i>
        Shopping
      </Link>
      <NavLink to="/profile" className="app-link">
        <i className="material-symbols-rounded">account_circle</i>
        Me
      </NavLink>
    </nav>
  );
}

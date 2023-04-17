import { Link } from "react-router-dom";

import "./Breadcrumbs.scss";

export interface BreadcrumbsProps {
  links: { text: string; href: string }[];
}

export default function Breadcrumbs({ links }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs">
      {links.map((l, i) => (
        <>
          {i === links.length - 1 ? (
            <span className="breadcrumb-link">{l.text}</span>
          ) : (
            <Link key={l.href} to={l.href} className="breadcrumb-link">
              {l.text}
            </Link>
          )}
          <div className="breadcrumb-divider">/</div>
        </>
      ))}
    </div>
  );
}

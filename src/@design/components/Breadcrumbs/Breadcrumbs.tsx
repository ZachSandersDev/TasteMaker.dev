import { Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import { BreadcrumbLink } from "../../../@modules/utils/useBreadcrumbs";

import Button from "../Button/Button";

import "./Breadcrumbs.scss";
export interface BreadcrumbsProps {
  links: (BreadcrumbLink | undefined)[];
}

export default function Breadcrumbs({ links }: BreadcrumbsProps) {
  const navigate = useNavigate();
  const filteredLinks = links.filter((l): l is BreadcrumbLink => !!l);
  const parent = [...filteredLinks].reverse().find((l) => l.href);

  return (
    <>
      <Button
        onClick={() => navigate(parent?.href || "/")}
        variant="icon"
        size="xm"
        iconBefore="arrow_back_ios_new"
      />

      {!!filteredLinks.filter((l) => l.href).length && (
        <div className="breadcrumbs">
          {filteredLinks.map((l, i) => (
            <Fragment key={l.href || i}>
              {!l.href ? (
                <span className="breadcrumb-link">{l.text}</span>
              ) : (
                <Link to={l.href} className="breadcrumb-link">
                  {l.text}
                </Link>
              )}
              <div className="breadcrumb-divider">/</div>
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}

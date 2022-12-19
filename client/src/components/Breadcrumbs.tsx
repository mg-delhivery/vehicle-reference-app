import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Breadcrumb } from 'flowbite-react';
import React, { ReactNode } from 'react';
import { Link, useMatches } from 'react-router-dom';

interface BreadcrumbsProps {
  divider?: string;
}

interface Breadcrumb {
  title: string;
  path: string;
}

interface BreadcrumbHandler {
  crumb: { title: string };
}

const crumbLink = (crumb: Breadcrumb, i: number): ReactNode => {
  return (
    <Link to={crumb.path}>
      {i > 0 && <FontAwesomeIcon icon={faChevronRight} className="mr-4" />}
      <span>{crumb.title}</span>
    </Link>
  );
};

const crumbText = (crumb: Breadcrumb, i: number): ReactNode => {
  return (
    <span>
      {i > 0 && <FontAwesomeIcon icon={faChevronRight} className="mr-4" />}
      {crumb.title}
    </span>
  );
};

export const Breadcrumbs = ({ divider = '/' }: BreadcrumbsProps) => {
  let matches = useMatches();
  let crumbs = matches
    .filter((match) => {
      const handle = match.handle as BreadcrumbHandler;
      return Boolean(handle?.crumb);
    })
    .map((match) => {
      const handle = match.handle as BreadcrumbHandler;

      return {
        title: handle.crumb.title,
        path: match.pathname,
      };
    });

  return crumbs.length > 1 ? (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {crumbs.map((crumb, i) => (
          <li key={i} className="inline-flex items-center">
            {i < crumbs.length - 1 ? crumbLink(crumb, i) : crumbText(crumb, i)}
          </li>
        ))}
      </ol>
    </nav>
  ) : (
    <span></span>
  );
};

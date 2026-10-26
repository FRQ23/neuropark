import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Migas de pan" className={`w3-small w3-margin-bottom ${className}`} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
      <Link to="/" className="w3-hover-text-black w3-text-grey" style={{ textDecoration: 'none', marginRight: '6px' }}>
        <i className="fa fa-home" aria-hidden="true"></i> Inicio
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label + index}>
            <span className="w3-text-grey" style={{ margin: '0 6px' }}>/</span>
            {isLast || !item.path ? (
              <span className="font-bold text-black" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="w3-hover-text-black w3-text-grey" style={{ textDecoration: 'none' }}>
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

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
    <nav aria-label="Migas de pan" className={`w3-bar w3-light-grey w3-small w3-padding-small w3-margin-bottom ${className}`}>
      <Link to="/" className="w3-bar-item w3-button" style={{ padding: '4px 8px' }}>
        <i className="fa fa-home" aria-hidden="true"></i> Inicio
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label + index}>
            <span className="w3-bar-item w3-text-grey" style={{ padding: '4px 2px' }}>/</span>
            {isLast || !item.path ? (
              <span className="w3-bar-item font-bold" aria-current="page" style={{ padding: '4px 8px' }}>
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="w3-bar-item w3-button" style={{ padding: '4px 8px' }}>
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

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
    <nav aria-label="Migas de pan" className={`flex items-center text-xs md:text-sm text-slate-500 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-calm-700 transition-colors py-1 focus-visible:outline focus-visible:outline-2"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label + index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              {isLast || !item.path ? (
                <span className="font-semibold text-slate-800" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-calm-700 transition-colors py-1 focus-visible:outline focus-visible:outline-2"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

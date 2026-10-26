import React from 'react';
import { RequirementStatus, UserRole, CommitteeSpecialty } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'status' | 'role' | 'specialty' | 'neutral' | 'scope';
  status?: RequirementStatus;
  role?: UserRole;
  specialty?: CommitteeSpecialty | 'general';
  scope?: string;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  status,
  role,
  specialty,
  scope,
  size = 'md',
  className = '',
  style,
}) => {
  const sizeClass = size === 'sm' ? 'w3-small' : '';

  if (status) {
    const config = {
      pending: { text: 'Pendiente', cls: 'w3-tag w3-khaki w3-border' },
      in_progress: { text: 'En progreso', cls: 'w3-tag w3-blue' },
      completed: { text: 'Completado', cls: 'w3-tag w3-teal' },
      validated: { text: 'Validado', cls: 'w3-tag w3-green' },
    }[status];

    return (
      <span className={`${config.cls} ${sizeClass} ${className}`} style={style}>
        {children || config.text}
      </span>
    );
  }

  if (role) {
    const roleConfig = {
      admin: { text: 'Administrador', cls: 'w3-tag w3-black' },
      committee: { text: 'Comité', cls: 'w3-tag w3-dark-grey' },
      viewer: { text: 'Observador', cls: 'w3-tag w3-light-grey' },
    }[role];

    return (
      <span className={`${roleConfig.cls} ${sizeClass} ${className}`}>
        {children || roleConfig.text}
      </span>
    );
  }

  if (specialty) {
    const specConfig = {
      education: { text: 'Educación', cls: 'w3-tag w3-blue' },
      psychology: { text: 'Psicología', cls: 'w3-tag w3-indigo' },
      finance: { text: 'Finanzas', cls: 'w3-tag w3-teal' },
      general: { text: 'General', cls: 'w3-tag w3-grey' },
    }[specialty];

    return (
      <span className={`${specConfig.cls} ${sizeClass} ${className}`}>
        {children || specConfig.text}
      </span>
    );
  }

  if (scope) {
    const scopeLabels: Record<string, string> = {
      local: 'Local (Ensenada)',
      estatal: 'Estatal (Baja California)',
      nacional: 'Nacional',
      internacional: 'Internacional',
    };

    return (
      <span className={`w3-tag w3-light-grey w3-border ${sizeClass} ${className}`}>
        {scopeLabels[scope] || scope}
      </span>
    );
  }

  return (
    <span className={`w3-tag w3-light-grey ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};

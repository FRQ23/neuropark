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
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  status,
  role,
  specialty,
  scope,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  // Requirement status badge
  if (status) {
    const config = {
      pending: {
        text: 'Pendiente',
        classes: 'bg-amber-100 text-amber-900 border border-amber-300',
        dot: 'bg-amber-500',
      },
      in_progress: {
        text: 'En progreso',
        classes: 'bg-blue-100 text-blue-900 border border-blue-300',
        dot: 'bg-blue-500',
      },
      completed: {
        text: 'Completado',
        classes: 'bg-teal-100 text-teal-900 border border-teal-300',
        dot: 'bg-teal-600',
      },
      validated: {
        text: 'Validado',
        classes: 'bg-emerald-100 text-emerald-950 font-semibold border border-emerald-400',
        dot: 'bg-emerald-600',
      },
    }[status];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses} ${config.classes} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
        {children || config.text}
      </span>
    );
  }

  // User role badge
  if (role) {
    const roleConfig = {
      admin: {
        text: 'Administrador',
        classes: 'bg-purple-100 text-purple-900 border border-purple-200',
      },
      committee: {
        text: 'Comité Especialista',
        classes: 'bg-calm-100 text-calm-900 border border-calm-300',
      },
      viewer: {
        text: 'Observador (Solo Lectura)',
        classes: 'bg-slate-100 text-slate-700 border border-slate-200',
      },
    }[role];

    return (
      <span className={`inline-flex items-center rounded-lg ${sizeClasses} ${roleConfig.classes} ${className}`}>
        {children || roleConfig.text}
      </span>
    );
  }

  // Specialty badge
  if (specialty) {
    const specConfig = {
      education: {
        text: 'Educación',
        classes: 'bg-sky-50 text-sky-800 border border-sky-200',
      },
      psychology: {
        text: 'Psicología',
        classes: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
      },
      finance: {
        text: 'Finanzas',
        classes: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      },
      general: {
        text: 'General / Gobierno',
        classes: 'bg-slate-100 text-slate-800 border border-slate-200',
      },
    }[specialty];

    return (
      <span className={`inline-flex items-center rounded-lg ${sizeClasses} ${specConfig.classes} ${className}`}>
        {children || specConfig.text}
      </span>
    );
  }

  // Association scope badge
  if (scope) {
    const scopeLabels: Record<string, string> = {
      local: 'Local (Ensenada)',
      estatal: 'Estatal (Baja California)',
      nacional: 'Nacional (México)',
      internacional: 'Internacional',
    };

    return (
      <span
        className={`inline-flex items-center rounded-md bg-stone-100 text-stone-800 border border-stone-200 ${sizeClasses} ${className}`}
      >
        {scopeLabels[scope] || scope}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

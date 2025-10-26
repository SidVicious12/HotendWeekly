import React from 'react';

export type ToolStatus = 'live' | 'beta' | 'preview' | 'planned-q1' | 'planned-q2' | 'planned-q3' | 'planned-q4';

interface ToolStatusBadgeProps {
  status: ToolStatus;
  className?: string;
}

const statusConfig: Record<ToolStatus, { label: string; color: string; icon: string }> = {
  'live': {
    label: 'Live',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: '✓'
  },
  'beta': {
    label: 'Beta',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '⚡'
  },
  'preview': {
    label: 'Private Preview',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '🔒'
  },
  'planned-q1': {
    label: 'Planned Q1 2025',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '📅'
  },
  'planned-q2': {
    label: 'Planned Q2 2025',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '📅'
  },
  'planned-q3': {
    label: 'Planned Q3 2025',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '📅'
  },
  'planned-q4': {
    label: 'Planned Q4 2025',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: '📅'
  }
};

export function ToolStatusBadge({ status, className = '' }: ToolStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

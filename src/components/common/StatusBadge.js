import React from 'react';
import { STATUS_BADGE_CONFIG } from '../../services/constants';

const StatusBadge = ({ status }) => {
  const config = STATUS_BADGE_CONFIG[status] || {
    className: 'badge bg-secondary',
    label: status,
  };

  return <span className={config.className}>{config.label}</span>;
};

export default StatusBadge;
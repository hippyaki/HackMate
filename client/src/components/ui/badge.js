// File: components/ui/badge.js
import React from 'react';

const Badge = ({ variant = 'default', children, className }) => {
  let baseClasses = 'inline-flex items-center px-2 py-0.5 rounded text-sm font-medium';
  let variantClasses =
    variant === 'default'
      ? 'bg-green-500 text-white'
      : 'bg-gray-300 text-gray-700';

  return (
    <span className={`${baseClasses} ${variantClasses} ${className || ''}`}>
      {children}
    </span>
  );
};

export default Badge;

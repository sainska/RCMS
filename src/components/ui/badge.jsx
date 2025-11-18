import React from 'react';

export function Badge({ children, className = '', variant = 'default', ...props }) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variants = {
    default: 'bg-primary/10 text-primary',
    secondary: 'bg-muted text-muted-foreground',
    destructive: 'bg-construction-danger/10 text-construction-danger',
    success: 'bg-construction-success/10 text-construction-success',
    warning: 'bg-construction-warning/10 text-construction-warning',
    outline: 'border border-muted bg-transparent'
  };
  const classes = `${base} ${variants[variant] || variants.default} ${className}`;
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Badge;

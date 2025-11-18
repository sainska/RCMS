import React from "react";

const variantClasses = {
  default:
    "bg-construction text-white shadow-lg shadow-construction/30 hover:bg-construction/90 focus:ring-construction",
  secondary:
    "bg-white text-construction shadow-md hover:bg-slate-50 border border-white/40 focus:ring-construction",
  outline:
    "border border-construction text-construction bg-transparent hover:bg-construction/10 focus:ring-construction",
};

export function Button({ children, className = "", variant = "default", ...props }) {
  const base =
    "px-5 py-2.5 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white";
  const classes = `${base} ${variantClasses[variant] || variantClasses.default} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;

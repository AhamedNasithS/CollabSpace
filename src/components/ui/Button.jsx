const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover border border-transparent",

  secondary:
    "bg-surface text-heading border border-border hover:bg-surface-muted",

  ghost:
    "bg-transparent text-body border border-transparent hover:bg-surface-muted hover:text-heading",

  destructive:
    "bg-danger text-white border border-transparent hover:bg-red-700",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  icon: "h-10 w-10",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-control
        font-medium
        transition-colors duration-150
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/30
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
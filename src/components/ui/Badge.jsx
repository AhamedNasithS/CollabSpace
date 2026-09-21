const variants = {
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200",

  primary:
    "bg-indigo-50 text-indigo-700 border-indigo-100",

  success:
    "bg-green-50 text-green-700 border-green-100",

  warning:
    "bg-amber-50 text-amber-700 border-amber-100",

  danger:
    "bg-red-50 text-red-700 border-red-100",

  info:
    "bg-sky-50 text-sky-700 border-sky-100",
};

function Badge({
  children,
  variant = "neutral",
  className = "",
}) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-md
        border
        px-2 py-0.5
        text-xs
        font-medium
        leading-5
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;
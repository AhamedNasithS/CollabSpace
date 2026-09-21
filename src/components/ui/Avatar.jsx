function getInitials(name = "") {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

function Avatar({
  name,
  src,
  alt,
  size = "md",
  className = "",
}) {
  return (
    <div
      className={`
        inline-flex shrink-0 items-center justify-center
        overflow-hidden
        rounded-full
        bg-indigo-100
        font-semibold
        text-indigo-700
        ${sizes[size]}
        ${className}
      `}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

export default Avatar;
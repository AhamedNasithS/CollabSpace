import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-heading"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          className={`
            h-10 w-full
            rounded-control
            border
            bg-surface
            px-3 pr-10
            text-sm text-heading
            outline-none
            transition
            placeholder:text-subtle

            ${
              error
                ? "border-danger focus:border-danger focus:ring-danger/15"
                : "border-border focus:border-primary focus:ring-primary/15"
            }

            focus:ring-2
            disabled:cursor-not-allowed
            disabled:bg-surface-muted
            disabled:text-muted

            ${className}
          `}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="
            absolute right-3 top-1/2
            -translate-y-1/2
            text-muted
            transition-colors
            hover:text-heading
            focus-visible:outline-none
            focus-visible:text-primary
          "
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default PasswordInput;
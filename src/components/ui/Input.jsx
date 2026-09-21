import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      id,
      className = "",
      ...props
    },
    ref
  ) => {
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

        <input
          ref={ref}
          id={id}
          className={`
            h-10 w-full
            rounded-control
            border
            bg-surface
            px-3
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
);

Input.displayName = "Input";

export default Input;
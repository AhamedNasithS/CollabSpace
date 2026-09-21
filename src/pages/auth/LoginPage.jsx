import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";

import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { getAuthErrorMessage } from "../../utils/authErrors";

const initialForm = {
  email: "",
  password: "",
};

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] =
    useSearchParams();

  const inviteCode =
    searchParams.get("invite");

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setSubmitError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await login({
        email: form.email.trim(),
        password: form.password,
      });

      if (inviteCode) {
        navigate(
          `/join/${inviteCode}`,
          {
            replace: true,
          }
        );

        return;
      }

      navigate(
        ROUTES.WORKSPACE_SETUP,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error("Login failed:", error);

      setSubmitError(
        getAuthErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-heading">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-muted">
          Sign in to continue to your workspace.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {submitError && (
          <div
            role="alert"
            className="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {submitError}
          </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="ahamed@example.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-heading"
            >
              Password
            </label>

            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Signing in..."
            : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />

        <span className="text-xs text-muted">
          or
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="secondary"
        className="w-full"
        disabled
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-primary hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";

import { ROUTES } from "../../constants/routes";

import useAuth from "../../hooks/useAuth";

import { getAuthErrorMessage } from "../../utils/authErrors";

const initialForm = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] =
    useSearchParams();

  const inviteCode =
    searchParams.get("invite");

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

    if (!form.displayName.trim()) {
      nextErrors.displayName =
        "Enter your full name.";
    }

    if (!form.email.trim()) {
      nextErrors.email =
        "Enter your email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password =
        "Create a password.";
    } else if (form.password.length < 8) {
      nextErrors.password =
        "Use at least 8 characters.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        "Confirm your password.";
    } else if (
      form.password !== form.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
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

      await register({
        displayName: form.displayName.trim(),
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
      console.error(
        "Registration failed:",
        error
      );

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
          Create your account
        </h1>

        <p className="mt-2 text-sm text-muted">
          Start collaborating with your team in
          CollabSpace.
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
            className="
              rounded-control
              border border-red-200
              bg-red-50
              px-4 py-3
              text-sm text-red-700
            "
          >
            {submitError}
          </div>
        )}

        <Input
          id="displayName"
          name="displayName"
          label="Full name"
          placeholder="Ahamed Nasith"
          autoComplete="name"
          value={form.displayName}
          onChange={handleChange}
          error={errors.displayName}
          disabled={isSubmitting}
        />

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

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          helperText="Use at least 8 characters."
          disabled={isSubmitting}
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Create Account"}
        </Button>

        <p className="text-center text-xs leading-5 text-muted">
          By creating an account, you agree to
          CollabSpace&apos;s{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
          >
            Terms
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </button>
          .
        </p>
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
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { ROUTES } from "../../constants/routes";
import useAuth from "../../hooks/useAuth";
import { getAuthErrorMessage } from "../../utils/authErrors";

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isSent, setIsSent] = useState(false);

  function validateEmail() {
    if (!email.trim()) {
      setError("Enter your email address.");
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      setError("Enter a valid email address.");
      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitError("");

    if (!validateEmail()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await resetPassword(email.trim());

      setIsSent(true);
    } catch (error) {
      console.error(
        "Password reset failed:",
        error
      );

      setSubmitError(
        getAuthErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <div className="w-full text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-primary">
          <Mail size={20} />
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-heading">
          Check your email
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          We sent password reset instructions to{" "}
          <span className="font-medium text-heading">
            {email}
          </span>
          .
        </p>

        <Link
          to={ROUTES.LOGIN}
          className="mt-6 block"
        >
          <Button className="w-full">
            Back to Sign In
          </Button>
        </Link>

        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Try another email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Link
        to={ROUTES.LOGIN}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-heading"
      >
        <ArrowLeft size={16} />

        Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-heading">
          Reset your password
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          Enter your email address and we'll send
          you a password reset link.
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
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
            setSubmitError("");
          }}
          error={error}
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Sending..."
            : "Send Reset Link"}
        </Button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
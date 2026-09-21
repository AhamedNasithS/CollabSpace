const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use":
    "An account already exists with this email address.",

  "auth/invalid-email":
    "Enter a valid email address.",

  "auth/weak-password":
    "Your password is too weak.",

  "auth/invalid-credential":
    "Incorrect email or password.",

  "auth/user-disabled":
    "This account has been disabled.",

  "auth/too-many-requests":
    "Too many attempts. Please wait a moment and try again.",

  "auth/network-request-failed":
    "Unable to connect. Check your internet connection and try again.",
};

export function getAuthErrorMessage(error) {
  return (
    AUTH_ERROR_MESSAGES[error?.code] ||
    "Something went wrong. Please try again."
  );
}
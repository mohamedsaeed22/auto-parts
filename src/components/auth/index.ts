export { default as AuthFlow } from "./AuthFlow";
export { default as ProtectedRoute } from "./ProtectedRoute";
export { default as LoginForm } from "./LoginForm";
export { default as RegisterForm } from "./RegisterForm";
export { default as OtpForm } from "./OtpForm";
export { default as RegistrationErrorHandler } from "./RegistrationErrorHandler";
export {
  withRegistrationErrorHandling,
  ProtectedPageWithErrorHandling,
} from "./withRegistrationErrorHandling";

// New Authentication System
export {
  AuthGuard,
  ProtectedPageGuard,
  AuthOnlyGuard,
  SilentAuthGuard,
  withAuthGuard,
} from "./AuthGuard";

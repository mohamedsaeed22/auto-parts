"use client";

import { useTranslation } from "react-i18next";
import { useAuth } from "@/services/api/auth";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect } from "react";

interface GoogleLoginButtonProps {
  className?: string;
}

export function GoogleLoginButton({ className }: GoogleLoginButtonProps) {
  const { t } = useTranslation("auth");
  const { login } = useAuthContext();
  const { googleLoginMutation } = useAuth();

  const handleGoogleLogin = useCallback(
    async (response: unknown) => {
      try {
        const result = await googleLoginMutation.mutateAsync({
          google_id: (response as { credential: string }).credential,
        });
        await login(result.data.token, result.data.user);
      } catch {
        // Error handling is done in the mutation
      }
    },
    [googleLoginMutation, login]
  );

  // Initialize Google Sign-In
  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      (
        window.google as {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: unknown) => void;
              }) => void;
              renderButton: (
                element: HTMLElement,
                config: { theme: string; size: string; width: string }
              ) => void;
            };
          };
        }
      ).accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleGoogleLogin,
      });

      (
        window.google as {
          accounts: {
            id: {
              initialize: (config: {
                client_id: string;
                callback: (response: unknown) => void;
              }) => void;
              renderButton: (
                element: HTMLElement,
                config: { theme: string; size: string; width: string }
              ) => void;
            };
          };
        }
      ).accounts.id.renderButton(
        document.getElementById("google-login-button")!,
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, [handleGoogleLogin]);

  return (
    <div id="google-login-button" className={className}>
      <Button
        variant="outline"
        className="w-full"
        disabled={googleLoginMutation.isPending}
      >
        {googleLoginMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {t("login.googleLogin")}
      </Button>
    </div>
  );
}

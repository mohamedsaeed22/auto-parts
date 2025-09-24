"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

// Import validation schemas and types
import {
  type LoginFormData,
  type RegistrationFormData,
} from "@/lib/validations/authSchema";

// Import separated auth components
import { LoginForm, OtpForm } from "./auth";
import { useSendOtpMutation } from "@/services/hooks";
import { showSuccess, showError } from "@/lib/toast";

interface LoginDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export default function LoginDialog({ trigger, className }: LoginDialogProps) {
  const { t } = useTranslation("auth");
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<"login" | "register" | "otp">(
    "login"
  );
  const [formData, setFormData] = useState<
    LoginFormData | RegistrationFormData | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Simple: send phone number to API
      const phoneNumber = data.phoneNumber || "";

      await sendOtp({ phone: phoneNumber }).unwrap();

      setFormData(data);
      setCurrentStep("otp");
      showSuccess(t("success.codeSent"));
    } catch (error) {
      showError(t("errors.otpSendError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentStep("login");
      setFormData(null);
      setIsLoading(false);
    }
  };

  const goBackToLogin = () => {
    setCurrentStep("login");
  };

  const goBackToRegister = () => {
    setCurrentStep("register");
  };

  const switchToRegister = () => {
    setCurrentStep("register");
  };

  const getDialogTitle = () => {
    switch (currentStep) {
      case "login":
        return t("login.title");
      case "register":
        return t("registration.title");
      case "otp":
        return t("auth.step2");
      default:
        return t("login.title");
    }
  };

  const getPhoneNumber = () => {
    if (!formData) return "";
    return "phoneNumber" in formData ? formData.phoneNumber || "" : "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className={className}>
            <User />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`${
          currentStep === "register" ? "sm:max-w-xl" : "sm:max-w-md"
        } max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="text-center">{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        {currentStep === "login" && (
          <LoginForm
            onSubmit={onLoginSubmit}
            onSwitchToRegister={switchToRegister}
            onSwitchToOtp={(phoneNumber) => {
              setFormData({ phoneNumber });
              setCurrentStep("otp");
            }}
            isLoading={isLoading || isSendingOtp}
          />
        )}

        {currentStep === "otp" && (
          <OtpForm
            onGoBack={
              formData && "shopName" in formData
                ? goBackToRegister
                : goBackToLogin
            }
            phoneNumber={getPhoneNumber()}
            onAuthSuccess={() => {
              // Handle successful authentication
              showSuccess(t("success.loginSuccess"));
              handleDialogChange(false);

              // Keep user on the same page after successful login
              // No navigation needed
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

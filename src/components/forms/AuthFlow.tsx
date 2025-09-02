"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoginForm from "./LoginForm";
import OtpForm from "./OtpForm";
import RegisterForm from "./RegisterForm";
import { storage } from "@/lib/storage";

type AuthStep = "login" | "otp" | "register";

interface AuthFlowProps {
  onAuthSuccess: (authData: import("@/lib/storage").AuthData) => void;
}

export default function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const { t } = useTranslation("auth");
  const [currentStep, setCurrentStep] = useState<AuthStep>("login");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSwitchToOtp = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentStep("otp");
  };

  const handleSwitchToRegister = () => {
    setCurrentStep("register");
  };

  const handleGoBackToLogin = () => {
    setCurrentStep("login");
  };

  const handleAuthSuccess = (authData: import("@/lib/storage").AuthData) => {
    onAuthSuccess(authData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "login":
        return (
          <LoginForm
            onSubmit={async () => {}} // This won't be used since we handle OTP flow
            onSwitchToRegister={handleSwitchToRegister}
            onSwitchToOtp={handleSwitchToOtp}
            isLoading={false}
          />
        );
      case "otp":
        return (
          <OtpForm
            onGoBack={handleGoBackToLogin}
            phoneNumber={phoneNumber}
            onAuthSuccess={handleAuthSuccess}
          />
        );
      case "register":
        return (
          <RegisterForm
            onSubmit={async () => {}} // Handle registration if needed
            onSwitchToLogin={handleGoBackToLogin}
            isLoading={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === "login"
                ? "bg-primary text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 rounded ${
              currentStep === "otp" || currentStep === "register"
                ? "bg-primary"
                : "bg-neutral-200"
            }`}
          />
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === "otp"
                ? "bg-primary text-white"
                : currentStep === "register"
                ? "bg-primary text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            2
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm text-neutral-600">
            {currentStep === "login" && t("auth.step1")}
            {currentStep === "otp" && t("auth.step2")}
            {currentStep === "register" && t("auth.step2")}
          </p>
        </div>
      </div>

      {/* Current Form */}
      {renderCurrentStep()}
    </div>
  );
}

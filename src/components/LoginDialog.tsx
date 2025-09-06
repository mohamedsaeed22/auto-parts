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
import { useRouter } from "next/navigation";

// Import validation schemas and types
import {
  type LoginFormData,
  type RegistrationFormData,
} from "@/lib/validations/authSchema";

// Import separated auth components
import { LoginForm, RegisterForm, OtpForm } from "./auth";
import { useSendOtpMutation } from "@/services/hooks";
import { showSuccess, showError } from "@/lib/toast";

interface LoginDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export default function LoginDialog({ trigger, className }: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<"login" | "register" | "otp">(
    "login"
  );
  const [formData, setFormData] = useState<
    LoginFormData | RegistrationFormData | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);

      // Simple: send phone number to API
      const phoneNumber = data.phoneNumber || "";
      console.log("Sending OTP to:", phoneNumber);

      await sendOtp({ phone: phoneNumber }).unwrap();

      setFormData(data);
      setCurrentStep("otp");
      showSuccess("تم إرسال رمز التحقق بنجاح!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      showError("حدث خطأ أثناء إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      console.log("Registration data:", data);

      // Call the real API to send OTP for registration
      const phoneNumber = data.phoneNumber || "";
      await sendOtp({ phone: phoneNumber }).unwrap();

      setFormData(data);
      setCurrentStep("otp");
      showSuccess("تم إرسال رمز التحقق بنجاح!");
    } catch (error) {
      console.error("Error submitting registration:", error);
      showError("حدث خطأ أثناء إرسال رمز التحقق");
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

  const switchToLogin = () => {
    setCurrentStep("login");
  };

  const getDialogTitle = () => {
    switch (currentStep) {
      case "login":
        return "تسجيل الدخول";
      case "register":
        return "إنشاء حساب جديد";
      case "otp":
        return "إدخال رمز التحقق";
      default:
        return "تسجيل الدخول";
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

        {currentStep === "register" && (
          <RegisterForm
            onSubmit={onRegisterSubmit}
            onSwitchToLogin={switchToLogin}
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
              showSuccess("تم تسجيل الدخول بنجاح!");
              handleDialogChange(false);

              // Redirect to home page after successful login
              router.push("/");
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

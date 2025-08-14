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

// Import validation schemas and types
import {
  type LoginFormData,
  type RegistrationFormData,
  type OtpFormData,
} from "@/lib/validations/authSchema";

// Import separated auth components
import { LoginForm, RegisterForm, OtpForm } from "./auth";

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

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      console.log("Login data:", data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormData(data);
      setCurrentStep("otp");
    } catch (error) {
      console.error("Error submitting login:", error);
      alert("حدث خطأ أثناء إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      console.log("Registration data:", data);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormData(data);
      setCurrentStep("otp");
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("حدث خطأ أثناء إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async (data: OtpFormData) => {
    try {
      setIsLoading(true);
      console.log("OTP data:", data);

      if (data.otp.length !== 6) {
        alert("يرجى إدخال رمز التحقق المكون من 6 أرقام");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        currentStep === "login" ? "تم تسجيل الدخول بنجاح!" : "تم التسجيل بنجاح!"
      );
      handleDialogChange(false);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("حدث خطأ أثناء التحقق من رمز التحقق");
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

  const resendOtp = async () => {
    if (!formData) {
      alert("لا توجد بيانات للنموذج");
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("تم إعادة إرسال رمز التحقق");
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("حدث خطأ أثناء إعادة إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
    }
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
    return "phoneNumber" in formData ? formData.phoneNumber : "";
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
            isLoading={isLoading}
          />
        )}

        {currentStep === "register" && (
          <RegisterForm
            onSubmit={onRegisterSubmit}
            onSwitchToLogin={switchToLogin}
            isLoading={isLoading}
          />
        )}

        {currentStep === "otp" && (
          <OtpForm
            onSubmit={onSubmitOtp}
            onGoBack={
              formData && "shopName" in formData
                ? goBackToRegister
                : goBackToLogin
            }
            onResendOtp={resendOtp}
            phoneNumber={getPhoneNumber()}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

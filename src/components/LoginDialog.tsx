"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  X,
  Upload,
  Phone,
  ArrowRight,
  Building,
  Store,
} from "lucide-react";
import Image from "next/image";

// Import validation schemas and types
import {
  loginSchema,
  registrationSchema,
  otpSchema,
  type LoginFormData,
  type RegistrationFormData,
  type OtpFormData,
  type LocationData,
  loginDefaultValues,
  registrationDefaultValues,
  otpDefaultValues,
  validateImageFile,
  isImageFile,
} from "@/lib/validations/authSchema";

// Import LocationPicker component
import LocationPicker from "./LocationPicker";

interface LoginDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export default function LoginDialog({ trigger, className }: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"login" | "register" | "otp">(
    "login"
  );
  const [formData, setFormData] = useState<
    LoginFormData | RegistrationFormData | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<"workshop" | "store" | "">(
    "workshop"
  );

  // React Hook Form setup for login
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  // React Hook Form setup for registration
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    reset: resetRegister,
    setValue,
    clearErrors,
    // watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: registrationDefaultValues,
  });

  // React Hook Form setup for OTP
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
    reset: resetOtp,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: otpDefaultValues,
  });

  const handleUserTypeChange = (type: "workshop" | "store") => {
    setUserType(type);
    setValue("userType", type);
    clearErrors("userType");
  };

  // Handle location selection from LocationPicker
  const handleLocationSelect = (location: LocationData) => {
    setValue("location", location);
    clearErrors("location");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // Use validation utilities from the schema
    if (!isImageFile(file)) {
      alert("يرجى اختيار ملف صورة صحيح");
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error || "يرجى اختيار ملف صورة صحيح");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setValue("documentImage", file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("documentImage", null as unknown as File);
    const fileInput = document.getElementById(
      "documentImage"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

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
      resetLogin();
      resetRegister();
      resetOtp();
      setImagePreview(null);
      setCurrentStep("login");
      setFormData(null);
      setIsLoading(false);
      setUserType("workshop");
    }
  };

  const goBackToLogin = () => {
    setCurrentStep("login");
    resetOtp();
  };

  const goBackToRegister = () => {
    setCurrentStep("register");
    resetOtp();
  };

  const switchToRegister = () => {
    setCurrentStep("register");
    resetLogin();
  };

  const switchToLogin = () => {
    setCurrentStep("login");
    resetRegister();
    setImagePreview(null);
    setUserType("workshop");
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
          currentStep === "register" ? "sm:max-w-4xl" : "sm:max-w-md"
        } max-h-[90vh] overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle className="text-center">{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        {currentStep === "login" && (
          <div className="space-y-6">
            <form
              onSubmit={handleSubmitLogin(onLoginSubmit)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  رقم الجوال
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...registerLogin("phoneNumber")}
                    type="tel"
                    id="phoneNumber"
                    dir="ltr"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                      loginErrors.phoneNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="+966 50 123 4567"
                  />
                </div>
                {loginErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {loginErrors.phoneNumber.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                disabled={isLoginSubmitting || isLoading}
              >
                {isLoginSubmitting || isLoading
                  ? "جاري الإرسال..."
                  : "إرسال رمز التحقق"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                ليس لديك حساب؟{" "}
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  إنشاء حساب
                </button>
              </p>
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition"
            >
              <Image
                src="/icons8-google.svg"
                alt="Google"
                className="w-5 h-5"
                width={20}
                height={20}
              />
              تسجيل الدخول باستخدام جوجل
            </button>
          </div>
        )}

        {currentStep === "register" && (
          <div className="space-y-6">
            <form
              onSubmit={handleSubmitRegister(onRegisterSubmit)}
              className="space-y-6"
            >
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                  نوع المستخدم
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange("workshop")}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === "workshop"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Building className="mx-auto mb-2" size={24} />
                    <span className="font-medium">ورشة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange("store")}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === "store"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Store className="mx-auto mb-2" size={24} />
                    <span className="font-medium">محل</span>
                  </button>
                </div>
                {registerErrors.userType && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {registerErrors.userType.message}
                  </p>
                )}
              </div>

              {/* Two-column grid for form inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="shopName"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    {userType === "workshop" ? "اسم الورشة" : "اسم المحل"}
                  </label>
                  <input
                    {...registerRegister("shopName")}
                    type="text"
                    id="shopName"
                    className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                      registerErrors.shopName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={
                      userType === "workshop"
                        ? "أدخل اسم الورشة"
                        : "أدخل اسم المحل"
                    }
                  />
                  {registerErrors.shopName && (
                    <p className="mt-1 text-sm text-red-600 text-right">
                      {registerErrors.shopName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="managerName"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    اسم المسؤول
                  </label>
                  <input
                    {...registerRegister("managerName")}
                    type="text"
                    id="managerName"
                    className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                      registerErrors.managerName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="أدخل اسم المسؤول"
                  />
                  {registerErrors.managerName && (
                    <p className="mt-1 text-sm text-red-600 text-right">
                      {registerErrors.managerName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    {...registerRegister("email")}
                    type="email"
                    id="email"
                    dir="ltr"
                    className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                      registerErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="example@email.com"
                  />
                  {registerErrors.email && (
                    <p className="mt-1 text-sm text-red-600 text-right">
                      {registerErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="taxCardNumber"
                    className="block text-sm font-medium text-gray-700 mb-2 text-right"
                  >
                    الرقم الضريبى
                  </label>
                  <input
                    {...registerRegister("taxCardNumber")}
                    type="text"
                    id="taxCardNumber"
                    className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                      registerErrors.taxCardNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="أدخل الرقم الضريبى"
                  />
                  {registerErrors.taxCardNumber && (
                    <p className="mt-1 text-sm text-red-600 text-right">
                      {registerErrors.taxCardNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Google Maps Location Picker */}
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={registrationDefaultValues.location}
                error={registerErrors.location?.message}
              />

              {/* Phone number - full width */}
              <div>
                <label
                  htmlFor="registerPhoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  رقم الجوال
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...registerRegister("phoneNumber")}
                    type="tel"
                    id="registerPhoneNumber"
                    dir="ltr"
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right ${
                      registerErrors.phoneNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="+966 50 123 4567"
                  />
                </div>
                {registerErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 text-right">
                    {registerErrors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Document image - full width */}
              <div>
                <label
                  htmlFor="documentImage"
                  className="block text-sm font-medium text-gray-700 mb-2 text-right"
                >
                  صورة السجل التجاري
                </label>
                <div className="space-y-2">
                  {!imagePreview ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors ${
                        registerErrors.documentImage
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        id="documentImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="documentImage"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          انقر لاختيار صورة أو اسحب الصورة هنا
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Document preview"
                        className="w-full h-48 object-cover rounded-lg border"
                        width={100}
                        height={100}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {registerErrors.documentImage && (
                    <p className="mt-1 text-sm text-red-600 text-right">
                      {typeof registerErrors.documentImage === "object" &&
                      "message" in registerErrors.documentImage
                        ? (registerErrors.documentImage as { message: string })
                            .message
                        : String(registerErrors.documentImage)}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                disabled={isRegisterSubmitting || isLoading}
              >
                {isRegisterSubmitting || isLoading
                  ? "جاري الإرسال..."
                  : "إنشاء الحساب"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{" "}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </div>
        )}

        {currentStep === "otp" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                تم إرسال رمز التحقق إلى{" "}
                {formData && "phoneNumber" in formData
                  ? formData.phoneNumber
                  : ""}
              </p>
            </div>

            <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2 text-center"
                >
                  رمز التحقق
                </label>
                <input
                  {...registerOtp("otp")}
                  type="text"
                  id="otp"
                  maxLength={6}
                  dir="ltr"
                  className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest ${
                    otpErrors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000000"
                />
                {otpErrors.otp && (
                  <p className="mt-1 text-sm text-red-600 text-center">
                    {otpErrors.otp.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    formData && "shopName" in formData
                      ? goBackToRegister
                      : goBackToLogin
                  }
                  className="flex-1 py-3"
                  disabled={isLoading}
                >
                  <ArrowRight className="w-4 h-4 ml-2" />
                  رجوع
                </Button>
                <Button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  disabled={isOtpSubmitting || isLoading}
                >
                  {isOtpSubmitting || isLoading ? "جاري التحقق..." : "تأكيد"}
                </Button>
              </div>
            </form>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={resendOtp}
                disabled={isLoading}
              >
                {isLoading ? "جاري الإرسال..." : "إعادة إرسال رمز التحقق"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

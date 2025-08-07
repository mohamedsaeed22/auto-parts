"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, X, Upload, ArrowLeft } from "lucide-react";
import Image from "next/image";

// Dynamic schema based on input mode
const createLoginSchema = (isEmailMode: boolean) => {
  const baseSchema = {
    shopName: z
      .string()
      .min(1, "اسم المحل أو الورشة مطلوب")
      .min(2, "اسم المحل أو الورشة يجب أن يكون على الأقل حرفين"),
    commercialRecord: z.string().min(1, "السجل التجاري/البطاقة الضريبية مطلوب"),
    documentImage: z
      .any()
      .refine(
        (file) => file instanceof File,
        "صورة السجل التجاري/البطاقة الضريبية مطلوبة"
      ),
  };

  if (isEmailMode) {
    return z.object({
      ...baseSchema,
      email: z
        .string()
        .min(1, "البريد الإلكتروني مطلوب")
        .email("يرجى إدخال بريد إلكتروني صحيح"),
    });
  } else {
    return z.object({
      ...baseSchema,
      phoneNumber: z
        .string()
        .min(1, "رقم الهاتف مطلوب")
        .regex(/^[0-9+\-\s()]+$/, "يرجى إدخال رقم هاتف صحيح"),
    });
  }
};

// OTP validation schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "يجب إدخال 6 أرقام")
    .max(6, "يجب إدخال 6 أرقام")
    .regex(/^[0-9]{6}$/, "يجب إدخال 6 أرقام فقط"),
});

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;
type OtpFormData = z.infer<typeof otpSchema>;

interface LoginDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

export default function LoginDialog({ trigger, className }: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState<LoginFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create dynamic schema
  const loginSchema = createLoginSchema(isEmailMode);

  // React Hook Form setup for main form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    clearErrors,
    getValues,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      shopName: "",
      commercialRecord: "",
    },
  });

  // React Hook Form setup for OTP
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
    reset: resetOtp,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("يرجى اختيار ملف صورة صحيح");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Set the file in the form
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
    setValue("documentImage", undefined);
    // Reset the file input
    const fileInput = document.getElementById(
      "documentImage"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      console.log("Form data:", data);

      // Remove these validation checks since they're redundant with schema validation
      // The schema already validates these fields, so if we reach here, they're valid
      // if (!data.shopName || !data.documentImage) {
      //   alert("يرجى ملء جميع الحقول المطلوبة");
      //   return;
      // }
      // if (isEmailMode && !data.email) {
      //   alert("يرجى إدخال البريد الإلكتروني");
      //   return;
      // }
      // if (!isEmailMode && !data.phoneNumber) {
      //   alert("يرجى إدخال رقم الهاتف");
      //   return;
      // }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store form data and move to OTP step
      setFormData(data);
      setCurrentStep("otp");

      // Simulate sending OTP (replace with actual API call)
      console.log(
        "Sending OTP to:",
        isEmailMode ? data.email : data.phoneNumber
      );

      // Show success message
      alert(
        `تم إرسال رمز التحقق إلى ${isEmailMode ? data.email : data.phoneNumber}`
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء إرسال النموذج");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtp = async (data: OtpFormData) => {
    try {
      setIsLoading(true);
      console.log("OTP data:", data);
      console.log("Complete form data:", formData);

      // Here you would verify the OTP with your backend
      // For demo purposes, we'll just check if it's 6 digits
      if (data.otp.length !== 6) {
        alert("يرجى إدخال رمز التحقق المكون من 6 أرقام");
        return;
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate OTP verification
      console.log("Verifying OTP:", data.otp);

      // Success - complete registration
      alert("تم التسجيل بنجاح!");
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
      reset(); // Reset main form
      resetOtp(); // Reset OTP form
      setImagePreview(null); // Reset image preview
      setCurrentStep("form"); // Reset to first step
      setFormData(null); // Clear stored form data
      setIsLoading(false); // Reset loading state
    }
  };

  const goBackToForm = () => {
    setCurrentStep("form");
    resetOtp();
  };

  const toggleInputType = () => {
    setIsEmailMode(!isEmailMode);
    // Clear the current input value and errors when switching modes
    if (isEmailMode) {
      setValue("email", "");
      clearErrors("email");
    } else {
      setValue("phoneNumber", "");
      clearErrors("phoneNumber");
    }
  };

  const resendOtp = async () => {
    if (!formData) {
      alert("لا توجد بيانات للنموذج");
      return;
    }

    try {
      setIsLoading(true);
      const contactInfo = isEmailMode ? formData.email : formData.phoneNumber;
      console.log("Resending OTP to:", contactInfo);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(`تم إعادة إرسال رمز التحقق إلى ${contactInfo}`);
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("حدث خطأ أثناء إعادة إرسال رمز التحقق");
    } finally {
      setIsLoading(false);
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep === "form" ? "تسجيل الدخول" : "إدخال رمز التحقق"}
          </DialogTitle>
        </DialogHeader>

        {currentStep === "form" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="shopName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                اسم المحل أو الورشة
              </label>
              <input
                {...register("shopName")}
                type="text"
                id="shopName"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.shopName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل اسم المحل أو الورشة"
              />
              {errors.shopName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.shopName.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor={isEmailMode ? "email" : "phoneNumber"}
                  className="block text-sm font-medium text-gray-700"
                >
                  {isEmailMode ? "البريد الإلكتروني" : "رقم الهاتف"}
                </label>
                <button
                  type="button"
                  onClick={toggleInputType}
                  className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {isEmailMode ? "استخدام الهاتف" : "استخدام الايميل"}
                </button>
              </div>
              {isEmailMode ? (
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  dir="rtl"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل البريد الإلكتروني"
                />
              ) : (
                <input
                  {...register("phoneNumber")}
                  type="tel"
                  id="phoneNumber"
                  dir="rtl"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم الهاتف"
                />
              )}
              {isEmailMode && errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
              {!isEmailMode && errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="documentImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                صورة السجل التجاري/البطاقة الضريبية
              </label>
              <div className="space-y-2">
                {!imagePreview ? (
                  <div
                    className={`border-2 border-dashed rounded-md p-4 text-center hover:border-blue-500 transition-colors ${
                      errors.documentImage
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
                      className="w-full h-48 object-cover rounded-md border"
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
                {errors.documentImage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.documentImage.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? "جاري إرسال رمز التحقق..."
                : "إرسال رمز التحقق"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                تم إرسال رمز التحقق إلى{" "}
                {isEmailMode ? formData?.email : formData?.phoneNumber}
              </p>
            </div>

            <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  رمز التحقق
                </label>
                <input
                  {...registerOtp("otp")}
                  type="text"
                  id="otp"
                  maxLength={6}
                  dir="ltr"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest ${
                    otpErrors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="000000"
                />
                {otpErrors.otp && (
                  <p className="mt-1 text-sm text-red-600">
                    {otpErrors.otp.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBackToForm}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  رجوع
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
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

        {/* Only show separator and Google login on first step */}
        {currentStep === "form" && (
          <>
            {/* Separator */}
            <div className="relative my-1">
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
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-black text-white hover:bg-gray-900 transition"
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

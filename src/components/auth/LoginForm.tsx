"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui";
import { Phone } from "lucide-react";
import Image from "next/image";
import {
  loginSchema,
  type LoginFormData,
  loginDefaultValues,
} from "@/lib/validations/authSchema";
import { useFormErrorTranslation } from "@/hooks/useFormErrorTranslation";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onSwitchToRegister: () => void;
  isLoading: boolean;
}

export default function LoginForm({
  onSubmit,
  onSwitchToRegister,
  isLoading,
}: LoginFormProps) {
  const { t } = useTranslation("auth");
  const { translateError } = useFormErrorTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  });

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label={t("login.phoneLabel")}
          placeholder={t("login.phonePlaceholder")}
          type="tel"
          register={register("phoneNumber")}
          error={translateError(errors.phoneNumber)}
          icon={Phone}
          iconPosition="left"
          dir="ltr"
          required
        />

        <Button
          type="submit"
          className="w-full py-3 text-white font-medium rounded-lg"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? t("login.submitButtonLoading")
            : t("login.submitButton")}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t("login.noAccount")}{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            {t("login.createAccount")}
          </button>
        </p>
      </div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            {t("login.orSeparator")}
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 text-black transition"
      >
        <Image
          src="/icons8-google.svg"
          alt="Google"
          className="w-5 h-5"
          width={20}
          height={20}
        />
        {t("login.googleLogin")}
      </button>
    </div>
  );
}

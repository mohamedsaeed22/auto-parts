"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/services/api/auth";
import { useAuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const phoneRegex = /^01[0-9]{9}$/; // Egyptian phone number format

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(phoneRegex, "Invalid phone number format"),
});

const otpSchema = z.object({
  code: z.string().min(4, "OTP code is required").max(6),
});

export function LoginForm() {
  const { t } = useTranslation("auth");
  const { login } = useAuthContext();
  const { sendOtpMutation, verifyOtpMutation } = useAuth();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [phone, setPhone] = useState("");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmitPhone = async (values: z.infer<typeof loginSchema>) => {
    try {
      await sendOtpMutation.mutateAsync({ phone: values.phone });
      setPhone(values.phone);
      setShowOtpInput(true);
    } catch {
      // Error handling is done in the mutation
    }
  };

  const onSubmitOtp = async (values: z.infer<typeof otpSchema>) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({
        phone,
        code: values.code,
      });
      login(response.data.token, response.data.user);
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {showOtpInput ? t("auth.step2") : t("auth.step1")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showOtpInput ? (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmitPhone)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.phoneLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("login.phonePlaceholder")}
                        {...field}
                        type="tel"
                        inputMode="numeric"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {sendOtpMutation.isPending
                  ? t("login.submitButtonLoading")
                  : t("login.submitButton")}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onSubmitOtp)}
              className="space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("otp.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("otp.placeholder")}
                        {...field}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyOtpMutation.isPending}
                >
                  {verifyOtpMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {verifyOtpMutation.isPending
                    ? t("otp.submitButtonLoading")
                    : t("otp.submitButton")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowOtpInput(false)}
                >
                  {t("otp.backButton")}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

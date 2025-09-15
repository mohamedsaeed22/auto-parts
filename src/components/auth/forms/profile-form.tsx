"use client";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid phone number format"),
});

export function ProfileForm() {
  const { t } = useTranslation("auth");
  const { user } = useAuthContext();
  // Placeholder for updateProfileMutation - to be implemented
  const updateProfileMutation = {
    mutate: () => {},
    mutateAsync: async () => ({}),
    isLoading: false,
    isPending: false,
  };

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async () => {
    try {
      const response = await updateProfileMutation.mutateAsync();
      // Placeholder response handling - to be implemented
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t("profile.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("profile.namePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("profile.emailPlaceholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.phoneLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("profile.phonePlaceholder")}
                      type="tel"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateProfileMutation.isPending
                ? t("profile.submitButtonLoading")
                : t("profile.submitButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

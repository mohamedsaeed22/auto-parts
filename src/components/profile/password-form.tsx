'use client';

import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useUpdatePassword } from '@/services/api/profile';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const passwordFormSchema = z
  .object({
    current_password: z
      .string()
      .min(8, 'Current password must be at least 8 characters'),
    password: z.string().min(8, 'New password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordForm() {
  const { t } = useTranslation('profile');
  const updatePasswordMutation = useUpdatePassword();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    await updatePasswordMutation.mutateAsync(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="current_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('currentPassword')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('newPassword')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirmPassword')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updatePasswordMutation.isPending}>
          {updatePasswordMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t('updatePassword')}
        </Button>
      </form>
    </Form>
  );
}
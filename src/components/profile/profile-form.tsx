'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { useProfile, useUpdateProfile, useDeleteAvatar } from '@/services/api/profile';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must be less than 255 characters'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 characters')
    .max(20, 'Phone must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  avatar: z.instanceof(File).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { t } = useTranslation('profile');
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const deleteAvatarMutation = useDeleteAvatar();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        phone: profile.phone || '',
      });
    }
  }, [form, profile]);

  const onSubmit = async (values: ProfileFormValues) => {
    await updateProfileMutation.mutateAsync(values);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar || undefined} />
            <AvatarFallback>{profile?.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) form.setValue('avatar', file);
                };
                input.click();
              }}
              disabled={
                updateProfileMutation.isPending ||
                deleteAvatarMutation.isPending
              }
            >
              <Upload className="h-4 w-4" />
              {t('uploadAvatar')}
            </Button>
            {profile?.avatar && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => deleteAvatarMutation.mutate()}
                disabled={
                  updateProfileMutation.isPending ||
                  deleteAvatarMutation.isPending
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('name')}</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>{t('phone')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            updateProfileMutation.isPending || deleteAvatarMutation.isPending
          }
        >
          {updateProfileMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t('saveChanges')}
        </Button>
      </form>
    </Form>
  );
}
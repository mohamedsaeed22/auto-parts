'use client';

import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useCreateReturn } from '@/services/api/returns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const returnFormSchema = z.object({
  reason: z
    .string()
    .min(1, 'Please select a reason')
    .max(255, 'Reason must be less than 255 characters'),
  details: z
    .string()
    .min(10, 'Details must be at least 10 characters')
    .max(1000, 'Details must be less than 1000 characters'),
});

type ReturnFormValues = z.infer<typeof returnFormSchema>;

interface ReturnFormProps {
  orderId: number;
  productId: number;
  quantity: number;
  open: boolean;
  onClose: () => void;
}

export function ReturnForm({
  orderId,
  productId,
  quantity,
  open,
  onClose,
}: ReturnFormProps) {
  const { t } = useTranslation('returns');
  const createReturnMutation = useCreateReturn();

  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      reason: '',
      details: '',
    },
  });

  const onSubmit = async (values: ReturnFormValues) => {
    await createReturnMutation.mutateAsync({
      order_id: orderId,
      product_id: productId,
      quantity,
      reason: `${values.reason}: ${values.details}`,
    });
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('returnRequest')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('reason')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectReason')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="defective">
                        {t('reasons.defective')}
                      </SelectItem>
                      <SelectItem value="wrong_item">
                        {t('reasons.wrongItem')}
                      </SelectItem>
                      <SelectItem value="not_as_described">
                        {t('reasons.notAsDescribed')}
                      </SelectItem>
                      <SelectItem value="damaged">
                        {t('reasons.damaged')}
                      </SelectItem>
                      <SelectItem value="other">{t('reasons.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('details')}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
                      placeholder={t('detailsPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={createReturnMutation.isPending}
              >
                {createReturnMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t('submit')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createReturnMutation.isPending}
              >
                {t('cancel')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
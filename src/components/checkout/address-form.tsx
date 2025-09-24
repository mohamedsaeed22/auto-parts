"use client";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "@/services/api/addressesApi";
import type { Address } from "@/services/api/types";
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
import { Checkbox } from "@/components/ui/checkbox";

const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  detailed_address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  address_type: z.enum(["home", "office", "other"]),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address;
  onSuccess?: () => void;
}

export function AddressForm({ address, onSuccess }: AddressFormProps) {
  const { t } = useTranslation("checkout");
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name || "",
      phone: address?.phone || "",
      detailed_address: address?.detailed_address || "",
      city: address?.city || "",
      postal_code: address?.postal_code || "",
      address_type: address?.address_type || "home",
      is_default: address?.is_default || false,
    },
  });

  const onSubmit = async (values: AddressFormValues) => {
    try {
      if (address) {
        await updateAddress({
          id: address.id,
          ...values,
        }).unwrap();
      } else {
        await createAddress(values).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done by the mutations
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.name")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-neutral-300 focus:border-logo-gold focus:ring-logo-gold"
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
              <FormLabel className="text-logo-black">
                {t("address.phone")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-neutral-300 focus:border-logo-gold focus:ring-logo-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="detailed_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.address")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-neutral-300 focus:border-logo-gold focus:ring-logo-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.city")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-neutral-300 focus:border-logo-gold focus:ring-logo-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.postalCode")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="border-neutral-300 focus:border-logo-gold focus:ring-logo-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.type")}
              </FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold bg-white"
                >
                  <option value="home">{t("address.typeHome")}</option>
                  <option value="office">{t("address.typeOffice")}</option>
                  <option value="other">{t("address.typeOther")}</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  checked={field.value as boolean}
                  onCheckedChange={(checked) =>
                    (field.onChange as (value: boolean) => void)(
                      checked as boolean
                    )
                  }
                  className="border-logo-gold data-[state=checked]:bg-logo-gold"
                />
              </FormControl>
              <FormLabel className="!mt-0 text-logo-black">
                {t("address.makeDefault")}
              </FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white"
          disabled={form.formState.isSubmitting}
        >
          {address ? t("address.update") : t("address.add")}
        </Button>
      </form>
    </Form>
  );
}

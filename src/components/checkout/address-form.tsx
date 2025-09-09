"use client";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "@/services/api/addressesApi";
import type { Address } from "@/services/api/checkout";
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
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
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
      address: address?.address || "",
      city: address?.city || "",
      state: address?.state || "",
      is_default: address?.is_default || false,
    },
  });

  const onSubmit = async (values: AddressFormValues) => {
    try {
      // Transform form values to match API expectations
      const apiData = {
        name: values.name,
        phone: values.phone,
        detailed_address: values.address,
        city: values.city,
        postal_code: values.state,
        address_type: "home" as const,
        is_default: values.is_default,
      };

      if (address) {
        await updateAddress({
          id: address.id,
          ...apiData,
        }).unwrap();
      } else {
        await createAddress(apiData).unwrap();
      }
      onSuccess?.();
    } catch (error) {
      // Error handling is done by the mutations
      console.error("Address form submission error:", error);
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
          name="address"
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
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.state")}
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

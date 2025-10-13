"use client";

import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import * as z from "zod";
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useGetCitiesQuery,
} from "@/services/api";
import type { Address } from "@/services/api/types";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
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
  national_address: z.string().min(1, "National address is required"),
  address_type: z.enum(["home", "office", "other"]),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  address?: Address;
  onSuccess?: () => void;
}

export function AddressForm({ address, onSuccess }: AddressFormProps) {
  const { t, i18n } = useTranslation("checkout");
  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  // Fetch cities from API with current locale
  const { data: citiesResponse } = useGetCitiesQuery(i18n.language);

  // Transform cities data to options format
  // Send city.key to backend, but display city.value (translated name) to user
  const cityOptions = useMemo(() => {
    if (!citiesResponse?.data?.cities) return [];
    return citiesResponse.data.cities.map((city) => ({
      value: city.key, // Send the key to backend
      label: city.value, // Display the translated name to user
      searchText: city.key, // Allow searching by English name too
    }));
  }, [citiesResponse]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: address?.name || "",
      phone: address?.phone || "",
      detailed_address: address?.detailed_address || "",
      city: address?.city || "",
      postal_code: address?.postal_code || "",
      national_address: address?.national_address || "",
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
    } catch {
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
              <SearchableSelect
                label={t("address.city")}
                placeholder={t("address.selectCity", "Select city")}
                searchPlaceholder={t("address.searchCity", "Search city...")}
                value={field.value as string}
                onValueChange={(value: string) =>
                  (field.onChange as (value: string) => void)(value)
                }
                options={cityOptions}
                error={form.formState.errors.city?.message}
                required
              />
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
          name="national_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-logo-black">
                {t("address.nationalAddress", "National Address")}
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

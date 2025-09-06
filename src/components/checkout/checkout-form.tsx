"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Address, useCheckout } from "@/services/api/checkout";
import { useCart } from "@/services/api/cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AddressList } from "./address-list";
import { Loader2 } from "lucide-react";

const checkoutSchema = z.object({
  address_id: z.number({
    required_error: "Please select a delivery address",
  }),
  payment_method: z.enum(["cash", "card"], {
    required_error: "Please select a payment method",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const { t } = useTranslation("checkout");
  const [selectedAddress, setSelectedAddress] = useState<Address>();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const checkoutMutation = useCheckout();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    await checkoutMutation.mutateAsync(values);
  };

  if (isCartLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cart?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">
          {t("errors.emptyCart")}
        </p>
        <Button variant="outline" asChild>
          <Link href="/products">{t("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">{t("deliveryAddress")}</h2>
          <FormField
            control={form.control}
            name="address_id"
            render={() => (
              <FormItem>
                <AddressList
                  selectedAddressId={selectedAddress?.id}
                  onSelect={(address) => {
                    setSelectedAddress(address);
                    form.setValue("address_id", address.id);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">{t("paymentMethod")}</h2>
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-2"
                  >
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value="cash" />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        {t("paymentMethods.cash")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <RadioGroupItem value="card" />
                      </FormControl>
                      <FormLabel className="!mt-0">
                        {t("paymentMethods.card")}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">
                {t("currency", { value: cart.meta.total_price })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("discount")}</span>
              <span className="font-medium text-destructive">
                -{t("currency", { value: cart.meta.total_discount })}
              </span>
            </div>
            <div className="flex items-center justify-between text-base font-bold">
              <span>{t("total")}</span>
              <span>{t("currency", { value: cart.meta.final_price })}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={checkoutMutation.isPending}
        >
          {t("placeOrder")}
        </Button>
      </form>
    </Form>
  );
}

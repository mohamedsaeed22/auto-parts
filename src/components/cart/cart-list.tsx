"use client";

import { useTranslation } from "react-i18next";
import { useCart, useClearCart } from "@/services/api/cart";
import { CartItem } from "./cart-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";

export function CartList() {
  const { t } = useTranslation("cart");
  const { data: cart, isLoading, isError } = useCart();
  const clearCartMutation = useClearCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">
          {t("errors.loadingFailed")}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (!cart?.data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <p className="text-center text-muted-foreground">{t("empty")}</p>
        <Button variant="outline" asChild>
          <Link href="/products">{t("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          onClick={() => clearCartMutation.mutate()}
          disabled={clearCartMutation.isPending}
        >
          <Trash2 className="h-4 w-4" />
          {t("clearCart")}
        </Button>
      </div>
      <div className="divide-y rounded-lg border">
        {cart.data.map((item) => (
          <CartItem key={item.id} item={item} className="p-4" />
        ))}
      </div>
      <div className="space-y-4 rounded-lg border p-4">
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
        <Button className="w-full" asChild>
          <Link href="/checkout">{t("checkout")}</Link>
        </Button>
      </div>
    </div>
  );
}

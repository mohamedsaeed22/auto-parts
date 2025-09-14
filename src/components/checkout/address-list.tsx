"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, MapPin, Plus } from "lucide-react";
import { useAddresses, useDeleteAddress } from "@/services/api/checkout";
import type { Address } from "@/services/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import UnifiedAddressForm from "@/components/shared/UnifiedAddressForm";
import { cn } from "@/lib/utils";

interface AddressListProps {
  selectedAddressId?: number;
  onSelect?: (address: Address) => void;
}

export function AddressList({ selectedAddressId, onSelect }: AddressListProps) {
  const { t, i18n } = useTranslation("addresses");
  const isRTL = i18n.language === "ar";
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address>();
  const { data: addressesResponse, isLoading, isError } = useAddresses();
  const deleteAddressMutation = useDeleteAddress();

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
          {t("errors.loadFailed")}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t("retry", "Retry")}
        </Button>
      </div>
    );
  }

  const addresses = addressesResponse?.data || [];

  const handleAddressClick = (address: Address) => {
    onSelect?.(address);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleDeleteAddress = async (address: Address) => {
    if (window.confirm(t("deleteDescription"))) {
      await deleteAddressMutation.mutateAsync(address.id);
    }
  };

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("addAddress")}
            </Button>
          </DialogTrigger>
          <DialogContent dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? t("editAddress") : t("addAddress")}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="text-center text-muted-foreground">
                {t(
                  "addressFormPlaceholder",
                  "Address form will be implemented here"
                )}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {addresses.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          {t("noAddresses")}
        </p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address: Address) => (
            <div
              key={address.id}
              className={cn(
                "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                selectedAddressId === address.id && "border-primary",
                onSelect && "cursor-pointer hover:border-primary"
              )}
              onClick={() => onSelect && handleAddressClick(address)}
            >
              <MapPin className="h-5 w-5 shrink-0 text-primary" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{address.name}</span>
                  {address.is_default && (
                    <span className="text-xs text-muted-foreground">
                      ({t("default")})
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {address.detailed_address}, {address.city}
                </p>
                {!onSelect && (
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(address);
                      }}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(address);
                      }}
                      disabled={deleteAddressMutation.isPending}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

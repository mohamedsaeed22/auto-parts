import React, { useEffect, useState, useMemo } from "react";
import { Truck, ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
} from "@/services/api/addressesApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AddressForm } from "@/components/address";
import { showSuccess, showError } from "@/lib/toast";
import type { AddressFormData } from "@/lib/validations/addressSchema";

import { Address } from "@/services/api/types";

interface ShippingStepProps {
  selectedAddress: number | null;
  onAddressSelect: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const ShippingStep: React.FC<ShippingStepProps> = ({
  selectedAddress,
  onAddressSelect,
  onNext,
  onBack,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const { data: addressesResp } = useGetAddressesQuery();
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addresses = useMemo(
    () => addressesResp?.data?.addresses || [],
    [addressesResp?.data?.addresses]
  );
  const hasAddresses = addresses.length > 0;

  const handleCreateAddress = async (data: AddressFormData) => {
    try {
      const addressData = {
        ...data,
        is_default: data.is_default || false,
      };
      const result = await createAddress(addressData).unwrap();
      showSuccess(t("addresses.success.addSuccess"));
      setIsDialogOpen(false);

      // Auto-select the newly created address
      if (result?.data?.id) {
        onAddressSelect(result.data.id);
      }
    } catch {
      showError(t("addresses.errors.addFailed"));
    }
  };

  // Auto-select first address if none selected
  useEffect(() => {
    if (
      hasAddresses &&
      (!selectedAddress ||
        !addresses.some((a: Address) => a.id === selectedAddress))
    ) {
      onAddressSelect(addresses[0].id);
    }
  }, [hasAddresses, addresses, selectedAddress, onAddressSelect]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 border-b border-logo-gold/30">
        <h2 className="text-2xl font-bold text-logo-black flex items-center">
          <Truck className="w-6 h-6 mx-3 text-logo-gold" />
          {t("shipping.title")}
        </h2>
        <p className="text-neutral-600 mt-1">{t("shipping.description")}</p>
      </div>

      <div className="p-6">
        <div className="space-y-4 mb-6">
          {hasAddresses ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedAddress === address.id
                    ? "border-logo-gold bg-logo-gold/10 shadow-md"
                    : "border-neutral-200 hover:border-logo-gold/40"
                }`}
                onClick={() => onAddressSelect(address.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 space-x-2">
                      <span className="font-semibold text-logo-black">
                        {address.name}
                      </span>
                      {address.is_default && (
                        <span className="bg-logo-gold/20 text-logo-black text-xs font-medium px-2 py-1 rounded-full">
                          {t("shipping.default")}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-700">{address.city}</p>
                    <p className="text-neutral-700">
                      {address.detailed_address}
                    </p>
                    <p className="text-neutral-700" dir="ltr">
                      {address.phone}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 border-2 border-dashed border-neutral-300 rounded-xl text-center text-neutral-600">
              {t("shipping.noAddresses", "No saved addresses yet.")}
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full mb-6 border-2 border-dashed border-logo-gold/50 py-4 text-logo-black hover:bg-white hover:text-gray-500 cursor-pointer flex items-center"
            >
              <Plus className="w-4 h-4 mx-2" />
              {t("shipping.addNewAddress")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" dir={isRTL ? "rtl" : "ltr"}>
            <DialogHeader>
              <DialogTitle className="text-logo-black">
                {t("shipping.addAddressTitle", "Add New Address")}
              </DialogTitle>
              <DialogDescription className="text-neutral-600">
                {t(
                  "shipping.addAddressDesc",
                  "Fill the form below to save your address"
                )}
              </DialogDescription>
            </DialogHeader>
            <AddressForm
              onSubmit={handleCreateAddress}
              onCancel={() => setIsDialogOpen(false)}
              isCreating={isCreating}
              showCancelButton={false}
              submitButtonText={t("address.add")}
              className="mt-4"
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-logo-gold text-logo-black hover:bg-logo-gold/10"
                >
                  {t("dialog.cancel", "Cancel")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 py-3 flex items-center border-logo-gold text-logo-black hover:bg-logo-gold/10 hover:text-logo-black"
          >
            {isRTL ? (
              <>
                <ArrowRight className="w-4 h-4 mx-2" />
                {t("shipping.back")}
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mx-2" />
                {t("shipping.back")}
              </>
            )}
          </Button>
          <Button
            onClick={onNext}
            disabled={!hasAddresses}
            className="flex-1 bg-logo-gold hover:bg-logo-gold/90 text-white py-3 flex items-center justify-center disabled:bg-logo-gold/50 disabled:text-white/70"
          >
            {isRTL ? (
              <>
                {t("shipping.paymentMethod")}
                <ArrowLeft className="w-4 h-4 mx-2" />
              </>
            ) : (
              <>
                {t("shipping.paymentMethod")}
                <ArrowRight className="w-4 h-4 mx-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShippingStep;

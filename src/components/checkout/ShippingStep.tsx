import React, { useEffect, useState } from "react";
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

import { Address } from "@/services/api/types";

interface ShippingStepProps {
  savedAddresses: Address[];
  selectedAddress: number | null;
  onAddressSelect: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const ShippingStep: React.FC<ShippingStepProps> = ({
  savedAddresses,
  selectedAddress,
  onAddressSelect,
  onNext,
  onBack,
}) => {
  const { t, i18n } = useTranslation("checkout");
  const isRTL = i18n.language === "ar";
  const { data: addressesResp } = useGetAddressesQuery();
  const [createAddress] = useCreateAddressMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    address_type: "home" as "home" | "office" | "other",
    name: "",
    phone: "",
    city: "",
    detailed_address: "",
    postal_code: "",
    is_default: false,
  });

  const addresses = addressesResp?.data?.addresses || [];
  const hasAddresses = addresses.length > 0;

  const handleCreateAddress = async () => {
    try {
      await createAddress(formState).unwrap();
      setIsDialogOpen(false);
    } catch (e) {
      // silently fail; upstream toasts (if any) will handle
    }
  };

  // Auto-select first address if none selected
  useEffect(() => {
    if (
      hasAddresses &&
      (!selectedAddress ||
        !addresses.some((a: any) => a.id === selectedAddress))
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
                  <button className="text-logo-black hover:text-logo-gold text-sm font-medium">
                    {t("shipping.edit")}
                  </button>
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
              className="w-full mb-6 border-2 border-dashed border-logo-gold/50 py-4 text-logo-black hover:border-logo-gold flex items-center"
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
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-logo-black">
                  {t("address.name")}
                </label>
                <input
                  className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-logo-black">
                  {t("address.phone")}
                </label>
                <input
                  className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold"
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState({ ...formState, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-logo-black">
                  {t("address.city")}
                </label>
                <input
                  className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold"
                  value={formState.city}
                  onChange={(e) =>
                    setFormState({ ...formState, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-logo-black">
                  {t("address.address")}
                </label>
                <input
                  className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold"
                  value={formState.detailed_address}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      detailed_address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-logo-black">
                    {t("address.postalCode")}
                  </label>
                  <input
                    className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold"
                    value={formState.postal_code}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        postal_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-logo-black">
                    {t("address.type")}
                  </label>
                  <select
                    className="mt-1 w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-logo-gold bg-white"
                    value={formState.address_type}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        address_type: e.target.value as any,
                      })
                    }
                  >
                    <option value="home">
                      {t("address.typeHome", "Home")}
                    </option>
                    <option value="office">
                      {t("address.typeOffice", "Office")}
                    </option>
                    <option value="other">
                      {t("address.typeOther", "Other")}
                    </option>
                  </select>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-logo-black">
                <input
                  type="checkbox"
                  checked={formState.is_default}
                  onChange={(e) =>
                    setFormState({ ...formState, is_default: e.target.checked })
                  }
                />
                {t("address.makeDefault")}
              </label>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-logo-gold text-logo-black hover:bg-logo-gold/10"
                >
                  {t("dialog.cancel", "Cancel")}
                </Button>
              </DialogClose>
              <Button
                onClick={handleCreateAddress}
                className="bg-logo-gold hover:bg-logo-gold/90 text-white"
              >
                {t("address.add")}
              </Button>
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

import { Control, Controller } from "react-hook-form";
import { Building, Store } from "lucide-react";
import { useTranslation } from "react-i18next";

// Generic interface that works with any form data that has a userType field
interface UserTypeSelectorProps<T extends { userType: "workshop" | "shop" }> {
  control: Control<T>;
}

export function UserTypeSelector<T extends { userType: "workshop" | "shop" }>({
  control,
}: UserTypeSelectorProps<T>) {
  const { t, i18n } = useTranslation("userPricing");
  const isRTL = i18n.language === "ar";

  return (
    <Controller
      // @ts-expect-error - userType is not a valid path
      name="userType"
      control={control}
      render={({ field }) => (
        <div>
          <label
            className={`block text-sm font-medium text-gray-700 mb-3 ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            {t("form.userType.label")}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => field.onChange("workshop")}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                field.value === "workshop"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Building className="mx-auto mb-2" size={24} />
              <span className="font-medium">{t("form.userType.workshop")}</span>
            </button>
            <button
              type="button"
              onClick={() => field.onChange("shop")}
              className={`p-4 border-2 rounded-lg text-center transition-colors ${
                field.value === "shop"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Store className="mx-auto mb-2" size={24} />
              <span className="font-medium">{t("form.userType.shop")}</span>
            </button>
          </div>
        </div>
      )}
    />
  );
}

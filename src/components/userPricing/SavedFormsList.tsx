import { Button } from "@/components/ui/button";
import { Send, Package } from "lucide-react";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { SavedFormItem } from "./SavedFormItem";
import { useTranslation } from "react-i18next";

interface SavedFormsListProps {
  savedForms: (UserPricingFormData & { id: string; submittedAt: Date })[];
  isSendingToBackend: boolean;
  onSendAll: () => void;
  onDeleteForm: (id: string) => void;
}

export function SavedFormsList({
  savedForms,
  isSendingToBackend,
  onSendAll,
  onDeleteForm,
}: SavedFormsListProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-logo-black">
          {t("userPricing.savedForms.title")}
        </h3>
        <span className="bg-logo-gold/20 text-logo-black text-sm px-3 py-1 rounded-full">
          {savedForms.length} {t("userPricing.savedForms.count")}
        </span>
      </div>

      {savedForms.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">{t("userPricing.savedForms.empty.title")}</p>
          <p className="text-gray-400 text-sm">
            {t("userPricing.savedForms.empty.description")}
          </p>
        </div>
      ) : (
        <>
          {/* Submit All Button */}
          <div className="mb-6">
            <Button
              onClick={onSendAll}
              disabled={isSendingToBackend}
              className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white py-3"
            >
              {isSendingToBackend ? (
                <div className="flex items-center justify-center">
                  <div className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                  {t("userPricing.savedForms.buttons.sending")}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {t("userPricing.savedForms.buttons.sendAll")}
                  <Send className={isRTL ? "ml-2" : "mr-2"} size={18} />
                </div>
              )}
            </Button>
          </div>

          {/* Saved Forms List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedForms.map((form, index) => (
              <SavedFormItem
                key={form.id}
                form={form}
                index={index}
                onDelete={onDeleteForm}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

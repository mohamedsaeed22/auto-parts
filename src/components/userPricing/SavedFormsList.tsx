import { Button } from "@/components/ui/button";
import { Send, Package, AlertCircle, CheckCircle, LogIn } from "lucide-react";
import { SavedUnifiedFormData } from "@/hooks/useUnifiedPricingForm";
import { SavedFormItem } from "./SavedFormItem";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";

interface SavedFormsListProps {
  savedForms: SavedUnifiedFormData[];
  isSendingToBackend: boolean;
  onSendAll: () => void;
  onDeleteForm: (id: string) => void;
  isAuthenticated: boolean;
  isRegistrationComplete: boolean;
}

export function SavedFormsList({
  savedForms,
  isSendingToBackend,
  onSendAll,
  onDeleteForm,
  isAuthenticated,
  isRegistrationComplete,
}: SavedFormsListProps) {
  const { t, i18n } = useTranslation("userPricing");
  const router = useRouter();
  const { currentLocale } = useLocale();
  const isRTL = i18n.language === "ar";

  const handleLoginClick = () => {
    router.push(`/${currentLocale}`);
  };

  const handleCompleteRegistrationClick = () => {
    router.push(`/${currentLocale}/complete-registration`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-logo-black">
          {t("savedForms.title")}
        </h3>
        <span className="bg-logo-gold/20 text-logo-black text-sm px-3 py-1 rounded-full">
          {savedForms.length} {t("savedForms.count")}
        </span>
      </div>

      {/* Authentication Status for Backend Operations */}
      {savedForms.length > 0 && (
        <div className="mb-4 p-3 rounded-lg border">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border-amber-200">
              <AlertCircle size={16} />
              <div className="flex-1">
                <p className="text-sm">
                  {t("auth.status.backendLoginRequired")}
                </p>
              </div>
              <Button
                onClick={handleLoginClick}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2 py-1"
              >
                <LogIn size={12} className="mr-1" />
                {t("auth.buttons.login")}
              </Button>
            </div>
          ) : !isRegistrationComplete ? (
            <div className="flex items-center gap-2 text-orange-700 bg-orange-50 border-orange-200">
              <AlertCircle size={16} />
              <div className="flex-1">
                <p className="text-sm">
                  {t("auth.status.backendCompleteRegistration")}
                </p>
              </div>
              <Button
                onClick={handleCompleteRegistrationClick}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1"
              >
                {t("auth.buttons.completeRegistration")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border-green-200">
              <CheckCircle size={16} />
              <p className="text-sm">{t("auth.status.backendReady")}</p>
            </div>
          )}
        </div>
      )}

      {savedForms.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">
            {t("savedForms.empty.title")}
          </p>
          <p className="text-gray-400 text-sm">
            {t("savedForms.empty.description")}
          </p>
        </div>
      ) : (
        <>
          {/* Submit All Button */}
          <div className="mb-6">
            <Button
              onClick={onSendAll}
              disabled={
                isSendingToBackend ||
                !isAuthenticated ||
                !isRegistrationComplete
              }
              className="w-full bg-logo-gold hover:bg-logo-gold/90 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingToBackend ? (
                <div className="flex items-center justify-center">
                  <div
                    className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${
                      isRTL ? "ml-2" : "mr-2"
                    }`}
                  ></div>
                  {t("savedForms.buttons.sending")}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {t("savedForms.buttons.sendAll")}
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

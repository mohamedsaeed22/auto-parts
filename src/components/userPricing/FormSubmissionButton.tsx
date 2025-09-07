import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FormSubmissionButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
}

export function FormSubmissionButton({
  isSubmitting,
  disabled = false,
}: FormSubmissionButtonProps) {
  const { t, i18n } = useTranslation("userPricing");
  const isRTL = i18n.language === "ar";

  return (
    <div className="pt-4">
      <Button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full py-3 bg-accent-dark hover:bg-accent-dark/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div
              className={`animate-spin rounded-full h-5 w-5 border-b-2 border-white ${
                isRTL ? "ml-2" : "mr-2"
              }`}
            ></div>
            {t("form.buttons.saving")}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Plus className={isRTL ? "ml-2" : "mr-2"} size={16} />
            {t("form.buttons.addToList")}
          </div>
        )}
      </Button>
    </div>
  );
}

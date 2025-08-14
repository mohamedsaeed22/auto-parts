import { Button } from "@/components/ui/button";
import { Send, Package } from "lucide-react";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";
import { SavedFormItem } from "./SavedFormItem";

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
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-logo-black">
          البيانات المحفوظة
        </h3>
        <span className="bg-logo-gold/20 text-logo-black text-sm px-3 py-1 rounded-full">
          {savedForms.length} نموذج
        </span>
      </div>

      {savedForms.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 text-lg mb-2">لا توجد بيانات محفوظة</p>
          <p className="text-gray-400 text-sm">
            املأ النموذج على اليمين لإضافة البيانات
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري الإرسال...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  إرسال جميع البيانات
                  <Send className="mr-2" size={18} />
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

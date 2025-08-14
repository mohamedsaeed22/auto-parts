import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FormSubmissionButtonProps {
  isSubmitting: boolean;
}

export function FormSubmissionButton({
  isSubmitting,
}: FormSubmissionButtonProps) {
  return (
    <div className="pt-4">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-logo-black hover:bg-logo-black/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
            جاري الحفظ...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            اضافة للقائمه
            <Plus className="mr-2" size={16} />
          </div>
        )}
      </Button>
    </div>
  );
}

"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface RejectConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function RejectConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RejectConfirmDialogProps) {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <div
            className={`flex items-center gap-3 mb-2 ${
              isRTL ? "flex-row" : "flex-row"
            }`}
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <DialogTitle
              className={`text-xl ${isRTL ? "text-right" : "text-left"}`}
            >
              {t("requests.rejectDialog.title", "Reject Request")}
            </DialogTitle>
          </div>
          <DialogDescription
            className={`text-base pt-2 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t(
              "requests.rejectDialog.description",
              "Are you sure you want to reject this request? This action cannot be undone."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p
              className={`text-sm text-red-800 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t(
                "requests.rejectDialog.warning",
                "Once rejected, you will need to create a new request if you want to proceed with this order."
              )}
            </p>
          </div>
        </div> */}

        <DialogFooter
          className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {t("requests.rejectDialog.cancel", "Cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading && (
              <Loader2
                className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`}
              />
            )}
            {t("requests.rejectDialog.confirm", "Yes, Reject")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

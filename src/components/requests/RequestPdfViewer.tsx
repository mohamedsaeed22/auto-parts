import React, { useRef } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "qrcode";

interface RequestItem {
  id: number;
  part_name: string;
  quantity: number;
  price_without_tax: number;
  tax: number;
  price: string;
  chassis_number: string | null;
  part_image_url: string | null;
  order_image_url: string | null;
  form_image_url: string | null;
}

interface RequestAddress {
  id: number;
  name: string;
  phone: string;
  address: string | null;
  city: string;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  is_default: boolean;
}

interface RequestData {
  id: number;
  user_id: number;
  user_type: string;
  user_type_label: string;
  status: string;
  payment_method: string;
  submitted_at: string;
  workshop_code: string;
  price: string;
  address_id: number | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  phone: string | null;
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  formatted_address: string;
  notes: string | null;
  tracking_number: string | null;
  pdf_label: string | null;
  payment_status: string;
  shipped_at: string | null;
  created_at: string;
  updated_at: string;
  address_details: RequestAddress | null;
  items: RequestItem[];
  calculated_total_without_tax: number;
  calculated_total_tax: number;
  calculated_total: number;
  delivery_amount_without_tax: number;
  delivery_amount_tax: number;
  delivery_amount: number;
  final_total: number;
  total_weight: number;
  calculated_total_weight: number;
  can_be_submitted: boolean;
  has_address_details: boolean;
}

interface RequestPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  requestData?: RequestData;
}

const RequestPdfViewer: React.FC<RequestPdfViewerProps> = ({
  isOpen,
  onClose,
  requestData,
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");

  // Transform request data for display
  const transformRequestData = (request: RequestData) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const fullName =
      request.full_name || request.address_details?.name || "غير محدد";
    const fullAddress =
      request.formatted_address ||
      (request.address_details
        ? `${request.address_details.address || ""}, ${
            request.address_details.city || ""
          }`.trim()
        : "غير محدد");
    const phone = request.phone || request.address_details?.phone || "غير محدد";

    return {
      date: formatDate(request.created_at),
      requestNumber: `#${request.id}`,
      clientName: fullName,
      vat: "313046229500003", // Static VAT number
      address: fullAddress,
      phone: phone,
      workshopCode: request.workshop_code,
      trackingNumber: request.tracking_number,
      // Company information - static values
      companyAddress: "شارع الأمير محمد بن عبد العزيز، حي الفيصلية، جدة",
      companyPhone: "0543777569",
      companyVat: "313046229500003",
      items: request.items.map((item) => ({
        id: item.id,
        title: item.part_name,
        chassisNumber: item.chassis_number,
        quantity: item.quantity,
        priceWithoutTax: item.price_without_tax,
        tax: item.tax,
        total: parseFloat(item.price),
      })),
      totalAmountWithoutTax: request.calculated_total_without_tax,
      vatAmount: request.calculated_total_tax,
      totalBeforeVat: request.calculated_total,
      deliveryAmount: request.delivery_amount,
      finalTotal: request.final_total,
      total: request.final_total,
    };
  };

  const data = requestData ? transformRequestData(requestData) : null;

  // Generate QR Code whenever data changes
  React.useEffect(() => {
    if (!data) return;

    const qrData = `رقم الطلب: ${data.requestNumber}\nالعميل: ${data.clientName}\nالمجموع: ${data.finalTotal} ر.س`;
    QRCode.toDataURL(qrData, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
      .then(setQrCodeUrl)
      .catch((error) => {
        console.error("Error generating QR code:", error);
        setQrCodeUrl("");
      });
  }, [data]);

  const handleDownload = async () => {
    if (!pdfRef.current) return;

    try {
      // Dynamically import html2canvas and jspdf
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Capture the element with html2canvas - simplified approach
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`فاتورة-طلب-${data?.requestNumber || "request"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      alert("حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right" dir="rtl">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-logo-black">
                فاتورة الطلب
              </span>
              <Button
                onClick={handleDownload}
                className="bg-logo-gold hover:bg-logo-gold/90 text-white"
              >
                <Download className="w-4 h-4 ml-2" />
                عرض الفاتورة
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* PDF Content */}
        {data ? (
          <div
            ref={pdfRef}
            id="pdf-content"
            className="bg-white p-8 rounded-lg shadow-sm"
            dir="rtl"
          >
            {/* Header */}
            <div
              className="pb-6 mb-6"
              style={{ borderBottom: "4px solid #b3984a" }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-logo-black">
                    فاتورة طلب قطع غيار
                  </h1>
                  <p className="font-semibold text-lg text-logo-gold">
                    فال بارتس - متجر قطع غيار السيارات
                  </p>
                  <div className="mt-4 text-sm text-gray-700">
                    <p className="mb-1">
                      <span className="font-semibold">العنوان:</span>{" "}
                      {data?.companyAddress ||
                        "شارع الأمير محمد بن عبد العزيز، حي الفيصلية، جدة"}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">رقم الهاتف:</span>{" "}
                      {data?.companyPhone || "0543777569"}
                    </p>
                    <p>
                      <span className="font-semibold">الرقم الضريبي:</span>{" "}
                      {data?.companyVat || "313046229500003"}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <div
                    className="w-32 h-32 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "rgba(179, 152, 74, 0.1)" }}
                  >
                    <img
                      src="./logo.png"
                      alt="Logo"
                      className="w-26 h-26 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* First Row - Request Information (2 columns, 3 rows) */}
            <div
              className="grid grid-cols-2 gap-6 mb-8 p-6 rounded-lg"
              style={{ backgroundColor: "#f9fafb" }}
            >
              <div className="space-y-4">
                <div
                  className="pr-4"
                  style={{ borderRight: "4px solid #D4AF37" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                    تاريخ الطلب
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.date}
                  </p>
                </div>
                <div
                  className="pr-4"
                  style={{ borderRight: "4px solid #D4AF37" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                    اسم العميل
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.clientName}
                  </p>
                </div>
                <div
                  className="pr-4"
                  style={{ borderRight: "4px solid #D4AF37" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                    العنوان
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.address}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div
                  className="pr-4"
                  style={{ borderRight: "4px solid #D4AF37" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                    رقم الطلب
                  </p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.requestNumber}
                  </p>
                </div>
                {data.workshopCode && (
                  <div
                    className="pr-4"
                    style={{ borderRight: "4px solid #D4AF37" }}
                  >
                    <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                      كود الورشة
                    </p>
                    <p
                      className="text-lg font-semibold"
                      style={{ color: "#1a1a1a" }}
                    >
                      {data.workshopCode}
                    </p>
                  </div>
                )}
                <div
                  className="pr-4"
                  style={{ borderRight: "4px solid #D4AF37" }}
                >
                  <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                    رقم الهاتف
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Second Row - Items Table */}
            <div className="mb-8">
              <h2
                className="text-2xl font-bold mb-4 pr-3"
                style={{ color: "#1a1a1a", borderRight: "4px solid #D4AF37" }}
              >
                تفاصيل قطع الغيار
              </h2>
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{ border: "1px solid #d1d5db" }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#D4AF37", color: "white" }}>
                      <th
                        className="p-3 text-right font-semibold"
                        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                      >
                        #
                      </th>
                      <th
                        className="p-3 text-right font-semibold"
                        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                      >
                        اسم القطعة
                      </th>
                      {requestData?.user_type !== "shop" && (
                        <th
                          className="p-3 text-center font-semibold"
                          style={{
                            border: "1px solid rgba(212, 175, 55, 0.3)",
                          }}
                        >
                          رقم الهيكل
                        </th>
                      )}
                      <th
                        className="p-3 text-center font-semibold"
                        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                      >
                        الكمية
                      </th>
                      <th
                        className="p-3 text-center font-semibold"
                        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                      >
                        السعر بدون ضريبة
                      </th>
                      <th
                        className="p-3 text-center font-semibold"
                        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                      >
                        الضريبة
                      </th>
                      <th
                        className="p-3 text-center font-semibold"
                        style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                      >
                        المجموع
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item, index) => (
                      <tr
                        key={item.id}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f9fafb" : "white",
                        }}
                      >
                        <td
                          className="p-3 text-center font-medium"
                          style={{ border: "1px solid #d1d5db" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="p-3 font-semibold"
                          style={{
                            border: "1px solid #d1d5db",
                            color: "#1a1a1a",
                          }}
                        >
                          {item.title}
                        </td>
                        {requestData?.user_type !== "shop" && (
                          <td
                            className="p-3 text-center font-medium"
                            style={{ border: "1px solid #d1d5db" }}
                          >
                            {item.chassisNumber || "غير محدد"}
                          </td>
                        )}
                        <td
                          className="p-3 text-center font-medium"
                          style={{ border: "1px solid #d1d5db" }}
                        >
                          {item.quantity}
                        </td>
                        <td
                          className="p-3 text-center font-medium"
                          style={{ border: "1px solid #d1d5db" }}
                        >
                          {item.priceWithoutTax.toFixed(2)} ر.س
                        </td>
                        <td
                          className="p-3 text-center font-medium"
                          style={{ border: "1px solid #d1d5db" }}
                        >
                          {item.tax.toFixed(2)} ر.س
                        </td>
                        <td
                          className="p-3 text-center font-semibold"
                          style={{
                            border: "1px solid #d1d5db",
                            color: "#1a1a1a",
                          }}
                        >
                          {item.total.toFixed(2)} ر.س
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Third Row - QR Code and Totals */}
            <div className="grid grid-cols-2 gap-6">
              <div
                className="space-y-2 rounded-lg p-5"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.1))",
                  border: "2px solid rgba(212, 175, 55, 0.2)",
                }}
              >
                {/* 1. Total Amount Without Tax */}
                <div
                  className="flex justify-between items-center pb-2"
                  style={{ borderBottom: "1px solid #d1d5db" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#374151" }}
                  >
                    الإجمالي بدون الضريبة
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.totalAmountWithoutTax.toFixed(2)} ر.س
                  </span>
                </div>

                {/* 2. Total Tax */}
                {data.vatAmount > 0 && (
                  <div
                    className="flex justify-between items-center pb-2"
                    style={{ borderBottom: "1px solid #d1d5db" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#374151" }}
                    >
                      الضريبة
                    </span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: "#1a1a1a" }}
                    >
                      {data.vatAmount.toFixed(2)} ر.س
                    </span>
                  </div>
                )}

                {/* 3. Total Including VAT */}
                <div
                  className="flex justify-between items-center pb-2"
                  style={{ borderBottom: "1px solid #d1d5db" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#374151" }}
                  >
                    الإجمالي شامل الضريبة
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.totalBeforeVat.toFixed(2)} ر.س
                  </span>
                </div>

                {/* 4. Delivery Amount */}
                {data.deliveryAmount > 0 && (
                  <div
                    className="flex justify-between items-center pb-2"
                    style={{ borderBottom: "1px solid #d1d5db" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#374151" }}
                    >
                      رسوم التوصيل
                    </span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: "#1a1a1a" }}
                    >
                      {data.deliveryAmount.toFixed(2)} ر.س
                    </span>
                  </div>
                )}

                {/* 5. Final Total */}
                <div
                  className="flex justify-between items-center pt-2 px-5 py-3 -mx-5 -mb-5 rounded-b-lg"
                  style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#1a1a1a" }}
                  >
                    الإجمالي النهائي
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#D4AF37" }}
                  >
                    {data.finalTotal.toFixed(2)} ر.س
                  </span>
                </div>
              </div>

              {/* QR Code - Left */}
              <div
                className="flex items-center justify-center rounded-lg p-6"
                style={{ backgroundColor: "#f9fafb" }}
              >
                {qrCodeUrl ? (
                  <div className="text-center">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-40 h-40 mx-auto mb-3"
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#4b5563" }}
                    >
                      امسح الكود للتحقق من الطلب
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div
                      className="w-40 h-40 rounded-lg flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: "#e5e7eb" }}
                    >
                      <FileText
                        className="w-16 h-16"
                        style={{ color: "#9ca3af" }}
                      />
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#4b5563" }}
                    >
                      جاري تحميل رمز QR...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div
              className="mt-8 pt-6 text-center"
              style={{ borderTop: "2px solid #e5e7eb" }}
            >
              <p className="text-sm" style={{ color: "#4b5563" }}>
                شكراً لتعاملكم معنا • نتمنى لكم تجربة تسوق ممتعة
              </p>
              <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
                للاستفسارات: parts@falfuture.com | 0543777569
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">لا توجد بيانات طلب متاحة</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RequestPdfViewer;

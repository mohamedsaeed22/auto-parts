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

interface OrderProduct {
  id: number;
  title: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: {
    date: string;
    orderNumber: string;
    clientName: string;
    vat: string;
    address: string;
    phone: string;
    products: OrderProduct[];
    subtotal: number;
    totalBeforeVat: number;
    vatAmount: number;
    totalAfterVat: number;
    total: number;
  };
}

const OrderPdfViewer: React.FC<OrderPdfViewerProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");

  // Default fake data
  const defaultOrderData = {
    date: "٢٠٢٥/١٠/٠١",
    orderNumber: "ORD-2025-001234",
    clientName: "أحمد محمد علي",
    vat: "123456789",
    address: "شارع الجمهورية، المنصورة، الدقهلية، مصر",
    phone: "+20 123 456 7890",
    products: [
      {
        id: 1,
        title: "فلتر زيت محرك",
        description: "فلتر زيت أصلي عالي الجودة للمحركات",
        quantity: 2,
        price: 150.0,
        total: 300.0,
      },
      {
        id: 2,
        title: "فرامل سيراميك",
        description: "فرامل سيراميك متطورة لأداء عالي",
        quantity: 4,
        price: 450.0,
        total: 1800.0,
      },
      {
        id: 3,
        title: "بطارية سيارة",
        description: "بطارية 70 أمبير بضمان سنتين",
        quantity: 1,
        price: 1200.0,
        total: 1200.0,
      },
      {
        id: 4,
        title: "إطار سيارة",
        description: "إطار مقاس 195/65 R15",
        quantity: 4,
        price: 800.0,
        total: 3200.0,
      },
    ],
    subtotal: 6500.0,
    totalBeforeVat: 6500.0,
    vatAmount: 975.0,
    totalAfterVat: 7475.0,
    total: 7475.0,
  };

  const data = orderData || defaultOrderData;

  // Generate QR Code whenever data changes
  React.useEffect(() => {
    const qrData = `رقم الطلب: ${data.orderNumber}\nالعميل: ${data.clientName}\nالمجموع: ${data.totalAfterVat} جنيه`;
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
      pdf.save(`فاتورة-${data.orderNumber}.pdf`);
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
                تحميل الفاتورة
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* PDF Content */}
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
                  فاتورة طلب
                </h1>
                <p className="font-semibold text-lg text-logo-gold">
                  متجر قطع غيار السيارات
                </p>
              </div>
              <div className="text-left">
                <div
                  className="w-32 h-32 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(179, 152, 74, 0.1)" }}
                >
                  <FileText className="w-16 h-16 text-logo-gold" />
                </div>
              </div>
            </div>
          </div>

          {/* First Row - Order Information (2 columns, 3 rows) */}
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
                  {data.orderNumber}
                </p>
              </div>
              <div
                className="pr-4"
                style={{ borderRight: "4px solid #D4AF37" }}
              >
                <p className="text-sm mb-1" style={{ color: "#4b5563" }}>
                  الرقم الضريبي
                </p>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {data.vat}
                </p>
              </div>
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
                  dir="ltr"
                >
                  {data.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Second Row - Products Table */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold mb-4 pr-3"
              style={{ color: "#1a1a1a", borderRight: "4px solid #D4AF37" }}
            >
              تفاصيل المنتجات
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
                      اسم المنتج
                    </th>
                    <th
                      className="p-3 text-right font-semibold"
                      style={{ border: "1px solid rgba(212, 175, 55, 0.3)" }}
                    >
                      الوصف
                    </th>
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
                      السعر
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
                  {data.products.map((product, index) => (
                    <tr
                      key={product.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f9fafb" : "white",
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
                        {product.title}
                      </td>
                      <td
                        className="p-3"
                        style={{
                          border: "1px solid #d1d5db",
                          color: "#374151",
                        }}
                      >
                        {product.description}
                      </td>
                      <td
                        className="p-3 text-center font-medium"
                        style={{ border: "1px solid #d1d5db" }}
                      >
                        {product.quantity}
                      </td>
                      <td
                        className="p-3 text-center font-medium"
                        style={{ border: "1px solid #d1d5db" }}
                      >
                        {product.price.toFixed(2)} جنيه
                      </td>
                      <td
                        className="p-3 text-center font-semibold"
                        style={{
                          border: "1px solid #d1d5db",
                          color: "#1a1a1a",
                        }}
                      >
                        {product.total.toFixed(2)} جنيه
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Third Row - QR Code and Totals */}
          <div className="grid grid-cols-2 gap-6">
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

            {/* Totals - Right */}
            <div
              className="space-y-3 rounded-lg p-6"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.1))",
                border: "2px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <div
                className="flex justify-between items-center pb-3"
                style={{ borderBottom: "1px solid #d1d5db" }}
              >
                <span className="font-medium" style={{ color: "#374151" }}>
                  المجموع الفرعي
                </span>
                <span
                  className="text-lg font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {data.subtotal.toFixed(2)} جنيه
                </span>
              </div>
              <div
                className="flex justify-between items-center pb-3"
                style={{ borderBottom: "1px solid #d1d5db" }}
              >
                <span className="font-medium" style={{ color: "#374151" }}>
                  المجموع قبل الضريبة
                </span>
                <span
                  className="text-lg font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {data.totalBeforeVat.toFixed(2)} جنيه
                </span>
              </div>
              <div
                className="flex justify-between items-center pb-3"
                style={{ borderBottom: "1px solid #d1d5db" }}
              >
                <span className="font-medium" style={{ color: "#374151" }}>
                  ضريبة القيمة المضافة (15%)
                </span>
                <span
                  className="text-lg font-semibold"
                  style={{ color: "#D4AF37" }}
                >
                  {data.vatAmount.toFixed(2)} جنيه
                </span>
              </div>
              <div
                className="flex justify-between items-center pb-3"
                style={{ borderBottom: "1px solid #d1d5db" }}
              >
                <span className="font-medium" style={{ color: "#374151" }}>
                  المجموع بعد الضريبة
                </span>
                <span
                  className="text-lg font-semibold"
                  style={{ color: "#1a1a1a" }}
                >
                  {data.totalAfterVat.toFixed(2)} جنيه
                </span>
              </div>
              <div
                className="flex justify-between items-center pt-3 px-6 py-4 -mx-6 -mb-6 rounded-b-lg"
                style={{ backgroundColor: "rgba(212, 175, 55, 0.2)" }}
              >
                <span
                  className="text-xl font-bold"
                  style={{ color: "#1a1a1a" }}
                >
                  الإجمالي النهائي
                </span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#D4AF37" }}
                >
                  {data.total.toFixed(2)} جنيه
                </span>
              </div>
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
              للاستفسارات: info@autoparts.com | +20 123 456 7890
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderPdfViewer;

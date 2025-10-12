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
  product_name: string;
  product_sku: string;
  product_image: string;
  price: number;
  discount_percentage: number;
  discount_amount: number;
  final_unit_price: number;
  quantity: number;
  total: number;
  line_total: number;
  product: {
    description: string;
  };
}

interface OrderAddress {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state?: string;
  country?: string;
  zip_code: string;
}

interface OrderPricing {
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_cost: number;
  total: number;
  currency: string;
}

interface OrderCoupon {
  code: string | null;
  discount: number;
  details: any;
}

interface OrderData {
  id: number;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  address: OrderAddress;
  pricing: OrderPricing;
  coupon: OrderCoupon;
  products: OrderProduct[];
  notes: string | null;
  tracking_number: string | null;
  total_items: number;
  created_at: string;
  can_be_cancelled: boolean;
  can_be_refunded: boolean;
}

interface OrderPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: OrderData;
}

const OrderPdfViewer: React.FC<OrderPdfViewerProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");

  // Transform order data for display
  const transformOrderData = (order: OrderData) => {
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
      `${order.address.first_name} ${order.address.last_name}`.trim();
    const fullAddress = [
      order.address.address,
      order.address.apartment,
      order.address.city,
      order.address.state,
      order.address.zip_code,
    ]
      .filter(Boolean)
      .join(", ");

    // Compute tax and price without tax from products when available
    const computedTotals = order.products.reduce(
      (acc, p) => {
        const quantity = p.quantity || 1;
        const productTax = (p as any)?.product?.tax ?? 0;
        const productPriceWithoutTax =
          (p as any)?.product?.price_without_tax ?? 0;
        return {
          totalAmountWithoutTax:
            acc.totalAmountWithoutTax + productPriceWithoutTax * quantity,
          totalTax: acc.totalTax + productTax * quantity,
        };
      },
      { totalAmountWithoutTax: 0, totalTax: 0 }
    );

    // Fallbacks if product fields are not available
    const fallbackTotalAmountWithoutTax = Math.max(
      0,
      (order.pricing?.subtotal || 0) - (order.pricing?.tax_amount || 0)
    );
    const fallbackTotalTax = order.pricing?.tax_amount || 0;

    const totalAmountWithoutTax =
      computedTotals.totalAmountWithoutTax || fallbackTotalAmountWithoutTax;
    const totalTax = computedTotals.totalTax || fallbackTotalTax;
    const totalBeforeDiscount = totalAmountWithoutTax + totalTax;
    const totalDiscount = order.pricing?.discount_amount || 0;
    const cartTotal = (order.pricing?.subtotal || 0) - totalDiscount;

    return {
      date: formatDate(order.created_at),
      orderNumber: order.order_number,
      clientName: fullName,
      vat: "313046229500003 ", // Static VAT number
      address: order.address.address,
      phone: order.address.phone,
      // Company information - static values since not provided in API response
      companyAddress: "شارع الأمير محمد بن عبد العزيز، حي الفيصلية، جدة",
      companyPhone: "0543777569",
      companyVat: "313046229500003",
      products: order.products.map((product) => ({
        id: product.id,
        title: product.product_name,
        description: product.product?.description || "لا يوجد وصف",
        quantity: product.quantity,
        price: product.final_unit_price,
        total: product.line_total,
      })),
      subtotal: order.pricing.subtotal,
      // Detailed breakdown to mirror checkout
      totalAmountWithoutTax,
      vatAmount: totalTax,
      totalBeforeVat: totalBeforeDiscount,
      cartTotal,
      totalAfterVat: order.pricing.total,
      total: order.pricing.total,
      discountAmount: totalDiscount,
      shippingCost: order.pricing.shipping_cost,
      couponCode: order.coupon.code,
      couponDiscount: order.coupon.discount,
    };
  };

  const data = orderData ? transformOrderData(orderData) : null;

  // Generate QR Code whenever data changes
  React.useEffect(() => {
    if (!data) return;

    const qrData = `رقم الطلب: ${data.orderNumber}\nالعميل: ${data.clientName}\nالمجموع: ${data.totalAfterVat} ر.س`;
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
      pdf.save(`فاتورة-${data?.orderNumber || "order"}.pdf`);
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
                    فاتورة طلب
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
                    {/* put logo here   */}
                    <img
                      src="./logo.png"
                      alt="Logo"
                      className="w-26 h-26 object-contain"
                    />
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
                    لا يوجد
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
                          {product.price.toFixed(2)} ر.س
                        </td>
                        <td
                          className="p-3 text-center font-semibold"
                          style={{
                            border: "1px solid #d1d5db",
                            color: "#1a1a1a",
                          }}
                        >
                          {product.total.toFixed(2)} ر.س
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

                {/* 4. Total Discount */}
                {data.discountAmount > 0 && (
                  <div
                    className="flex justify-between items-center pb-2"
                    style={{ borderBottom: "1px solid #d1d5db" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#374151" }}
                    >
                      إجمالي الخصم
                    </span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: "#dc2626" }}
                    >
                      - {data.discountAmount.toFixed(2)} ر.س
                    </span>
                  </div>
                )}

                {/* 5. Cart Total */}
                <div
                  className="flex justify-between items-center pb-2"
                  style={{ borderBottom: "1px solid #d1d5db" }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#374151" }}
                  >
                    إجمالي السلة
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.cartTotal.toFixed(2)} ر.س
                  </span>
                </div>

                {/* 6. Coupon Discount */}
                {data.couponCode && data.couponDiscount > 0 && (
                  <div
                    className="flex justify-between items-center pb-2"
                    style={{ borderBottom: "1px solid #d1d5db" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#374151" }}
                    >
                      خصم القسيمة
                    </span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: "#D4AF37" }}
                    >
                      - {data.couponDiscount.toFixed(2)} ر.س
                    </span>
                  </div>
                )}

                {/* 7. Shipping */}
                <div
                  className="flex justify-between items-center pb-2"
                  style={{ borderBottom: "1px solid #d1d5db" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#374151" }}
                  >
                    الشحن
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ color: "#1a1a1a" }}
                  >
                    {data.shippingCost > 0
                      ? `${data.shippingCost.toFixed(2)} ر.س`
                      : "مجاناً"}
                  </span>
                </div>

                {/* 8. Final Total */}
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
                    {data.totalAfterVat.toFixed(2)} ر.س
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

export default OrderPdfViewer;

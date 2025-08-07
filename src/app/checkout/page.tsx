"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { items, total, totalItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "السعودية",
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const steps = [
    { id: 1, title: "معلومات الشحن", icon: Truck },
    { id: 2, title: "طريقة الدفع", icon: CreditCard },
    { id: 3, title: "تأكيد الطلب", icon: CheckCircle },
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");

    // Simulate API call for coupon validation
    setTimeout(() => {
      const validCoupons = {
        SAVE10: 10,
        WELCOME20: 20,
        FREESHIP: 15,
      };

      if (validCoupons[couponCode.toUpperCase()]) {
        setCouponDiscount(validCoupons[couponCode.toUpperCase()]);
        setCouponError("");
      } else {
        setCouponError("كوبون غير صحيح");
        setCouponDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
  };

  // Calculate final total with coupon
  const finalTotal = total * 1.15 - couponDiscount;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            عربة التسوق فارغة
          </h2>
          <p className="text-gray-600 mb-6">لا توجد منتجات في عربة التسوق</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-black hover:bg-black/80"
          >
            العودة للتسوق
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            تم الطلب بنجاح!
          </h2>
          <p className="text-gray-600 mb-6">
            شكراً لك على طلبك. سنقوم بإرسال تأكيد عبر البريد الإلكتروني
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-black hover:bg-black/80"
            >
              العودة للرئيسية
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              العودة
            </button>
            <h1 className="text-xl font-bold text-gray-900">إتمام الطلب</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.id
                          ? "bg-black border-black text-white"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mr-3 text-sm font-medium ${
                        currentStep >= step.id ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.id ? "bg-black" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              {currentStep === 1 && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      معلومات الشحن
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الاسم الأول
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          اسم العائلة
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          required
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          العنوان
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          المدينة
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              city: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الرمز البريدي
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.postalCode}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              postalCode: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-black/80"
                  >
                    المتابعة للدفع
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                </form>
              )}

              {currentStep === 2 && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      طريقة الدفع
                    </h2>

                    {/* Payment Method Selection */}
                    <div className="space-y-4 mb-6">
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "card"
                            ? "border-black bg-black/5"
                            : "border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 ml-3" />
                          <span className="font-medium">بطاقة ائتمان</span>
                        </div>
                      </div>
                      <div
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "cod"
                            ? "border-black bg-black/5"
                            : "border-gray-300"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <div className="flex items-center">
                          <Truck className="w-5 h-5 ml-3" />
                          <span className="font-medium">
                            الدفع عند الاستلام
                          </span>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم البطاقة
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentInfo.cardNumber}
                            onChange={(e) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                cardNumber: e.target.value,
                              })
                            }
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              تاريخ الانتهاء
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentInfo.expiryDate}
                              onChange={(e) =>
                                setPaymentInfo({
                                  ...paymentInfo,
                                  expiryDate: e.target.value,
                                })
                              }
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              required
                              value={paymentInfo.cvv}
                              onChange={(e) =>
                                setPaymentInfo({
                                  ...paymentInfo,
                                  cvv: e.target.value,
                                })
                              }
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسم حامل البطاقة
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentInfo.cardHolder}
                            onChange={(e) =>
                              setPaymentInfo({
                                ...paymentInfo,
                                cardHolder: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4 space-x-reverse">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 me-2"
                    >
                      رجوع
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-black hover:bg-black/80"
                    >
                      مراجعة الطلب
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </div>
                </form>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                      تأكيد الطلب
                    </h2>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        ملخص الطلب
                      </h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 space-x-reverse"
                          >
                            <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                الكمية: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {(item.price * item.quantity).toFixed(2)} ر.س
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        معلومات الشحن
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center">
                          <User className="w-4 h-4 ml-2 text-gray-500" />
                          {shippingInfo.firstName} {shippingInfo.lastName}
                        </p>
                        <p className="flex items-center">
                          <Mail className="w-4 h-4 ml-2 text-gray-500" />
                          {shippingInfo.email}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 ml-2 text-gray-500" />
                          {shippingInfo.phone}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 ml-2 text-gray-500" />
                          {shippingInfo.address}, {shippingInfo.city}
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">
                        طريقة الدفع
                      </h3>
                      <p className="text-sm text-gray-600">
                        {paymentMethod === "card"
                          ? "بطاقة ائتمان"
                          : "الدفع عند الاستلام"}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4 space-x-reverse">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 me-2"
                    >
                      رجوع
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-black hover:bg-black/80"
                    >
                      {isProcessing ? "جاري معالجة الطلب..." : "تأكيد الطلب"}
                      {!isProcessing && <Shield className="w-4 h-4 mr-2" />}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                ملخص الطلب
              </h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 space-x-reverse"
                  >
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        الكمية: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} ر.س
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="space-y-3">
                  <div className="flex space-x-2 space-x-reverse">
                    <input
                      type="text"
                      placeholder="أدخل كوبون الخصم"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      disabled={couponDiscount > 0}
                    />
                    {couponDiscount > 0 ? (
                      <Button
                        onClick={handleRemoveCoupon}
                        variant="outline"
                        size="sm"
                        className="px-3 py-2 text-xs"
                      >
                        إلغاء
                      </Button>
                    ) : (
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim() || isApplyingCoupon}
                        size="sm"
                        className="px-3 py-2 text-xs bg-green-600 hover:bg-green-700"
                      >
                        {isApplyingCoupon ? "جاري..." : "تطبيق"}
                      </Button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-600">{couponError}</p>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>الخصم المطبق</span>
                      <span>-{couponDiscount.toFixed(2)} ر.س</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{total.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الشحن</span>
                  <span className="font-medium">مجاناً</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الضريبة</span>
                  <span className="font-medium">
                    {(total * 0.15).toFixed(2)} ر.س
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم</span>
                    <span>-{couponDiscount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-black">
                      {finalTotal.toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Shipping Info */}
              <div className="mt-6 space-y-4">
                {/* Security Badge */}
                <div className="p-4 bg-green-50 rounded-lg">    
                  <div className="space-y-2 text-xs text-green-700">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-green-600 ml-2" />
                      <p>معالجة دفع آمنة مع تشفير SSL</p>
                    </div>
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-green-600 ml-2" />
                      <p>شحن مجاني للطلبات التي تزيد عن 50 دولار</p>
                    </div>
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 text-green-600 ml-2" />
                      <p>ضمان استرداد الأموال لمدة 30 يوماً</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

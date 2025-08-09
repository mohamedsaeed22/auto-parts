"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  MapPin,
  ShoppingBag,
  RefreshCw,
  Plus,
  Minus,
  X,
  Clock,
  Package,
  Loader2,
  Trash,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CheckoutPage = () => {
  const router = useRouter();
  const {
    items,
    total,
    totalItems,
    clearCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(0);
  // Remove the isEditingCart state

  const steps = [
    {
      id: 1,
      title: "مراجعة السلة",
      icon: ShoppingBag,
      desc: "تأكيد المنتجات والكميات",
    },
    { id: 2, title: "معلومات الشحن", icon: Truck, desc: "عنوان التوصيل" },
    {
      id: 3,
      title: "طريقة الدفع",
      icon: CreditCard,
      desc: "اختيار طريقة الدفع",
    },
    {
      id: 4,
      title: "مراجعة الطلب",
      icon: CheckCircle,
      desc: "التأكيد النهائي",
    },
  ];

  const savedAddresses = [
    {
      id: 0,
      label: "المنزل",
      name: "أحمد محمد",
      address: "شارع الملك فهد، حي النزهة",
      city: "الرياض",
      phone: "+966 50 123 4567",
      isDefault: true,
    },
    {
      id: 1,
      label: "العمل",
      name: "أحمد محمد",
      address: "مركز الملك عبدالله المالي، طريق الملك فهد",
      city: "الرياض",
      phone: "+966 11 234 5678",
      isDefault: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/");
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      const validCoupons = {
        SAVE10: 10,
        WELCOME20: 20,
        FREESHIP: 15,
      };

      if (validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons]) {
        setCouponDiscount(
          validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons]
        );
        setCouponError("");
      } else {
        setCouponError("كوبون غير صحيح");
        setCouponDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const finalTotal = total * 1.15 - couponDiscount;

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            عربة التسوق فارغة
          </h2>
          <p className="text-gray-600 mb-8">لا توجد منتجات في عربة التسوق</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-full font-medium shadow-lg"
          >
            العودة للتسوق
          </Button>
        </motion.div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            تم الطلب بنجاح!
          </h2>
          <p className="text-gray-600 mb-2">رقم الطلب: #12345</p>
          <p className="text-gray-600 mb-8">
            سيتم توصيل طلبك خلال 2-3 أيام عمل
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-full font-medium"
            >
              العودة للتسوق
            </Button>
            <Button
              variant="outline"
              className="w-full border-2 border-gray-300 py-3 rounded-full font-medium"
            >
              تتبع الطلب
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-black border-black text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  <step.icon className="w-f h-5" />
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
                    className={`flex-1 h-0.5 mx-6 ${
                      currentStep > step.id ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200"
              >
                {/* Step 1: Cart Review */}
                {currentStep === 1 && (
                  <div>
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <ShoppingBag className="w-6 h-6 ml-3" />
                          مراجعة سلة التسوق ({totalItems} من السلع)
                        </h2>
                        {/* Remove the edit button */}
                      </div>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6"
                        >
                          <div className="flex items-start space-x-4 space-x-reverse">
                            <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                                {item.title}
                              </h3>
                              <div className="flex items-center space-x-4 space-x-reverse mb-3">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                  في المخزون
                                </span>
                              </div>

                              <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="flex items-center bg-white border-2 border-gray-400 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => {
                                      if (item.quantity === 1) {
                                        removeFromCart(item.id);
                                      } else {
                                        updateQuantity(
                                          item.id,
                                          Math.max(1, item.quantity - 1)
                                        );
                                      }
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none border-r border-gray-300 flex items-center justify-center"
                                  >
                                    {item.quantity === 1 ? (
                                      <Trash size={16} />
                                    ) : (
                                      <Minus size={16} />
                                    )}
                                  </button>

                                  <div className="h-8 px-3 flex items-center justify-center bg-gray-100 min-w-[40px]">
                                    <span className="text-sm font-semibold text-gray-800">
                                      {item.quantity}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-700 rounded-none border-l border-gray-300 flex items-center justify-center"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>

                                {/* Remove the delete button - trash icon handles removal */}
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <p className="text-2xl font-bold text-gray-900 mb-1">
                                {(item.price * item.quantity).toFixed(2)} ريال
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-gray-600">
                                  {item.price.toFixed(2)} ريال / قطعة
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-6 border-t border-gray-200">
                      <Button
                        onClick={handleNext}
                        className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium w-full"
                      >
                        المتابعة إلى معلومات الشحن
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping Information */}
                {currentStep === 2 && (
                  <div>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Truck className="w-6 h-6 ml-3" />
                        معلومات الشحن
                      </h2>
                      <p className="text-gray-600 mt-1">
                        اختر عنوان التوصيل أو أضف عنواناً جديداً
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              selectedAddress === address.id
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedAddress(address.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                  <span className="font-semibold text-gray-900">
                                    {address.label}
                                  </span>
                                  {address.isDefault && (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                      افتراضي
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-900 font-medium">
                                  {address.name}
                                </p>
                                <p className="text-gray-600">
                                  {address.address}
                                </p>
                                <p className="text-gray-600">{address.city}</p>
                                <p className="text-gray-600">{address.phone}</p>
                              </div>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                تعديل
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mb-6 border-2 border-dashed border-gray-300 py-4 text-gray-600 hover:border-gray-400"
                      >
                        <Plus className="w-4 h-4 ml-2" />
                        إضافة عنوان جديد
                      </Button>

                      <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center text-green-800 mb-2">
                          <Clock className="w-5 h-5 ml-2" />
                          <span className="font-medium">
                            توصيل مجاني خلال يومين
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          اطلب خلال 5 ساعات و 23 دقيقة للحصول على التوصيل في
                          موعدك المحدد
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1 py-3"
                        >
                          رجوع
                        </Button>
                        <Button
                          onClick={handleNext}
                          className="flex-1 bg-black hover:bg-gray-800 text-white py-3"
                        >
                          طريقة الدفع
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {currentStep === 3 && (
                  <div>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <CreditCard className="w-6 h-6 ml-3" />
                        طريقة الدفع
                      </h2>
                      <p className="text-gray-600 mt-1">
                        اختر الطريقة المناسبة للدفع
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === "card"
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod("card")}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CreditCard className="w-6 h-6 ml-3 text-gray-600" />
                              <div>
                                <span className="font-medium text-gray-900 text-lg">
                                  بطاقة ائتمان أو خصم
                                </span>
                                <p className="text-sm text-gray-600">
                                  Visa, MasterCard, American Express
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                                VISA
                              </div>
                              <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                                MC
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            paymentMethod === "cod"
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setPaymentMethod("cod")}
                        >
                          <div className="flex items-center">
                            <Truck className="w-6 h-6 ml-3 text-gray-600" />
                            <div>
                              <span className="font-medium text-gray-900 text-lg">
                                الدفع عند الاستلام
                              </span>
                              <p className="text-sm text-gray-600">
                                ادفع نقداً عند وصول الطلب
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {paymentMethod === "card" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4 mb-6"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              رقم البطاقة
                            </label>
                            <input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                تاريخ الانتهاء
                              </label>
                              <input
                                type="text"
                                placeholder="MM/YY"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                placeholder="123"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              اسم حامل البطاقة
                            </label>
                            <input
                              type="text"
                              placeholder="كما هو مكتوب على البطاقة"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                          </div>
                        </motion.div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1 py-3"
                        >
                          رجوع
                        </Button>
                        <Button
                          onClick={handleNext}
                          className="flex-1 bg-black hover:bg-gray-800 text-white py-3"
                        >
                          مراجعة الطلب
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Order Review */}
                {currentStep === 4 && (
                  <div>
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Package className="w-6 h-6 ml-3" />
                        مراجعة الطلب النهائية
                      </h2>
                      <p className="text-gray-600 mt-1">
                        تأكد من جميع التفاصيل قبل التأكيد
                      </p>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Order Items Summary */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <ShoppingBag className="w-4 h-4 ml-2" />
                          المنتجات ({totalItems})
                        </h3>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3 space-x-reverse"
                            >
                              <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  الكمية: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-medium">
                                {(item.price * item.quantity).toFixed(2)} ريال
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <MapPin className="w-4 h-4 ml-2" />
                          عنوان التوصيل
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-gray-900">
                            {savedAddresses[selectedAddress].name}
                          </p>
                          <p>{savedAddresses[selectedAddress].address}</p>
                          <p>{savedAddresses[selectedAddress].city}</p>
                          <p>{savedAddresses[selectedAddress].phone}</p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <CreditCard className="w-4 h-4 ml-2" />
                          طريقة الدفع
                        </h3>
                        <p className="text-sm text-gray-600">
                          {paymentMethod === "card"
                            ? "بطاقة ائتمان/خصم"
                            : "الدفع عند الاستلام"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1 py-3"
                        >
                          رجوع
                        </Button>
                        <Button
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="flex-1 bg-black hover:bg-gray-800 text-white py-3"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              جاري معالجة الطلب...
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4 mr-2" />
                              تأكيد الطلب
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">ملخص الطلب</h3>
              </div>

              <div className="p-6">
                {/* Delivery Info */}
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center text-green-800 mb-2">
                    <Clock className="w-4 h-4 ml-2" />
                    <span className="font-medium text-sm">
                      توصيل مجاني خلال يومين
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    اطلب خلال 5 ساعات و 23 دقيقة
                  </p>
                </div>

                {/* Coupon Section - Only show in first 3 steps */}
                {currentStep < 4 && (
                  <div className="mb-6">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="أدخل كوبون الخصم"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={couponDiscount > 0}
                      />
                      {couponDiscount > 0 ? (
                        <Button
                          onClick={() => {
                            setCouponCode("");
                            setCouponDiscount(0);
                            setCouponError("");
                          }}
                          variant="outline"
                          size="sm"
                          className="px-4"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || isApplyingCoupon}
                          size="sm"
                          className="px-3 py-2 text-xs bg-black hover:bg-gray-800 text-white"
                        >
                          {isApplyingCoupon ? "جاري..." : "تطبيق"}
                        </Button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 mt-2">{couponError}</p>
                    )}
                    {couponDiscount > 0 && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm text-green-800">
                          <span>تم تطبيق الخصم</span>
                          <span className="font-medium">
                            -{couponDiscount.toFixed(2)} ريال
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الفرعي</span>
                    <span className="font-medium">{total.toFixed(2)} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الشحن</span>
                    <span className="font-medium text-green-600">مجاناً</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الضريبة المضافة</span>
                    <span className="font-medium">
                      {(total * 0.15).toFixed(2)} ريال
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span className="font-medium">
                        -{couponDiscount.toFixed(2)} ريال
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-orange-600">
                      {finalTotal.toFixed(2)} ريال
                    </span>
                  </div>
                </div>

                {currentStep === 4 && (
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-medium text-lg shadow-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin ml-2" />
                        جاري معالجة الطلب...
                      </div>
                    ) : (
                      <>
                        تأكيد الطلب
                        <CheckCircle className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </Button>
                )}

                {/* Security Features */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-600 ml-2" />
                    <span>دفع آمن ومشفر 256-bit SSL</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <RefreshCw className="w-4 h-4 text-blue-600 ml-2" />
                    <span>إمكانية الإرجاع خلال 30 يوماً</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-purple-600 ml-2" />
                    <span>دعم عملاء على مدار الساعة</span>
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

"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Send,
  User,
  Package,
  Hash,
  Image as ImageIcon,
  Building,
  Store,
} from "lucide-react";
import Image from "next/image";

export default function UserPricingPage() {
  const [userType, setUserType] = useState<"workshop" | "store" | "">(
    "workshop"
  );
  const [formData, setFormData] = useState({
    userCode: "",
    partName: "",
    partImage: null as File | null,
    quantity: "",
    chassisNumber: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        partImage: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      userCode: "",
      partName: "",
      partImage: null,
      quantity: "",
      chassisNumber: "",
    });
    setImagePreview(null);
    setIsSubmitting(false);

    // Show success message (you can implement a toast notification here)
    alert("تم إرسال طلب التسعير بنجاح! سنتواصل معك قريباً.");
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, partImage: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* use this color #b9974d */}
      <div className="bg-gradient-to-r from-[#b9974d] to-[#b9974d] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">طلب تسعير القطع</h1>
            <p className="text-xl text-green-100 mb-4">
              أرسل لنا تفاصيل القطعة التي تحتاجها وسنقوم بتسعيرها لك
            </p>
            <p className="text-lg text-green-200">
              احصل على أفضل الأسعار وأسرع الخدمات من خبرائنا
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                نموذج طلب التسعير
              </h2>
              <p className="text-gray-600">
                املأ النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                  نوع المستخدم
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType("workshop")}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === "workshop"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Building className="mx-auto mb-2" size={24} />
                    <span className="font-medium">ورشة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("store")}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      userType === "store"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Store className="mx-auto mb-2" size={24} />
                    <span className="font-medium">محل</span>
                  </button>
                </div>
              </div>

              {/* User Code Input - Only for Workshop */}
              {userType === "workshop" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    <User className="inline ml-2" size={16} />
                    كود الورشة
                  </label>
                  <input
                    type="text"
                    name="userCode"
                    value={formData.userCode}
                    onChange={handleInputChange}
                    placeholder="أدخل كود الورشة الخاص بك"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1 text-right">
                    يمكنك تغيير الكود للحصول على نقاط إضافية
                  </p>
                </div>
              )}

              {/* Part Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  <Package className="inline ml-2" size={16} />
                  اسم القطعة
                </label>
                <input
                  type="text"
                  name="partName"
                  value={formData.partName}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم القطعة المطلوبة"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Part Image Upload - Only for Workshop */}
              {userType === "workshop" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    <ImageIcon className="inline ml-2" size={16} />
                    صورة القطعة
                  </label>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="partImage"
                    />
                    <label
                      htmlFor="partImage"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                    >
                      <div className="text-center">
                        <Upload
                          className="mx-auto text-gray-400 mb-2"
                          size={24}
                        />
                        <p className="text-sm text-gray-500">
                          اضغط لاختيار صورة القطعة
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG, GIF حتى 5MB
                        </p>
                      </div>
                    </label>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="معاينة الصورة"
                          className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          width={100}
                          height={100}
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  الكمية
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="أدخل الكمية المطلوبة"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Chassis Number Input - Only for Workshop */}
              {userType === "workshop" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    <Hash className="inline ml-2" size={16} />
                    رقم الهيكل
                  </label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الهيكل"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1 text-right">
                    رقم الهيكل يساعد في تحديد القطعة المناسبة لسيارتك
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !userType}
                  className="w-full py-3 bg-black hover:bg-black text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                      جاري الإرسال...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      إرسال طلب التسعير
                      <Send className="mr-2" size={16} />
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Additional Information */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 text-right">
                معلومات مهمة:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 text-right">
                <li>• سيتم الرد على طلبك خلال 24 ساعة عمل</li>
                {userType === "workshop" && (
                  <>
                    <li>• تأكد من إرفاق صورة واضحة للقطعة</li>
                    <li>• رقم الهيكل يساعد في تحديد القطعة المناسبة</li>
                    <li>• يمكنك تتبع طلبك من خلال رمز المستخدم</li>
                  </>
                )}
                {userType === "store" && (
                  <li>• للمحلات: نقدم أسعار خاصة بالجملة</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

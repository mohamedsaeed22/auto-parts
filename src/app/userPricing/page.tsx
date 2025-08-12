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
  X,
  Trash2,
} from "lucide-react";
import Image from "next/image";

// Define the type for saved form data
interface SavedFormData {
  id: string;
  userType: "workshop" | "store";
  userCode: string;
  partName: string;
  partImage: File | null;
  partImagePreview: string | null;
  requestImage: File | null;
  requestImagePreview: string | null;
  formImage: File | null;
  formImagePreview: string | null;
  quantity: string;
  chassisNumber: string;
  submittedAt: Date;
}

export default function UserPricingPage() {
  const [userType, setUserType] = useState<"workshop" | "store" | "">(
    "workshop"
  );
  const [formData, setFormData] = useState({
    userCode: "",
    partName: "",
    partImage: null as File | null,
    requestImage: null as File | null,
    formImage: null as File | null,
    quantity: "",
    chassisNumber: "",
  });
  const [partImagePreview, setPartImagePreview] = useState<string | null>(null);
  const [requestImagePreview, setRequestImagePreview] = useState<string | null>(
    null
  );
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedForms, setSavedForms] = useState<SavedFormData[]>([]);
  const [isSendingToBackend, setIsSendingToBackend] = useState(false);
  const partImageInputRef = useRef<HTMLInputElement>(null);
  const requestImageInputRef = useRef<HTMLInputElement>(null);
  const formImageInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        partImage: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPartImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRequestImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        requestImage: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setRequestImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        formImage: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save the current form data to the saved forms array
    const newSavedForm: SavedFormData = {
      id: Date.now().toString(),
      userType: userType as "workshop" | "store",
      userCode: formData.userCode,
      partName: formData.partName,
      partImage: formData.partImage,
      partImagePreview: partImagePreview,
      requestImage: formData.requestImage,
      requestImagePreview: requestImagePreview,
      formImage: formData.formImage,
      formImagePreview: formImagePreview,
      quantity: formData.quantity,
      chassisNumber: formData.chassisNumber,
      submittedAt: new Date(),
    };

    setSavedForms((prev) => [...prev, newSavedForm]);

    // Reset form
    setFormData({
      userCode: "",
      partName: "",
      partImage: null,
      requestImage: null,
      formImage: null,
      quantity: "",
      chassisNumber: "",
    });
    setPartImagePreview(null);
    setRequestImagePreview(null);
    setFormImagePreview(null);
    setIsSubmitting(false);

    // Reset file inputs
    if (partImageInputRef.current) {
      partImageInputRef.current.value = "";
    }
    if (requestImageInputRef.current) {
      requestImageInputRef.current.value = "";
    }
    if (formImageInputRef.current) {
      formImageInputRef.current.value = "";
    }

    // Show success message
    // alert("تم حفظ البيانات! يمكنك إضافة المزيد أو إرسال الكل إلى الخادم.");
  };

  const deleteSavedForm = (id: string) => {
    setSavedForms((prev) => prev.filter((form) => form.id !== id));
  };

  const sendAllToBackend = async () => {
    if (savedForms.length === 0) {
      alert("لا توجد بيانات لإرسالها!");
      return;
    }

    setIsSendingToBackend(true);

    try {
      // Prepare data for backend (convert to a format suitable for API)
      const dataToSend = savedForms.map((form) => ({
        id: form.id,
        userType: form.userType,
        userCode: form.userCode,
        partName: form.partName,
        hasPartImage: form.partImage !== null,
        partImageName: form.partImage?.name || null,
        hasRequestImage: form.requestImage !== null,
        requestImageName: form.requestImage?.name || null,
        hasFormImage: form.formImage !== null,
        formImageName: form.formImage?.name || null,
        quantity: form.quantity,
        chassisNumber: form.chassisNumber,
        submittedAt: form.submittedAt.toISOString(),
      }));

      // For development - log to console
      console.log("Sending data to backend:", dataToSend);
      console.log("Full saved forms with images:", savedForms);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear saved forms after successful submission
      setSavedForms([]);

      alert("تم إرسال جميع البيانات بنجاح!");
    } catch (error) {
      console.error("Error sending data:", error);
      alert("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
    } finally {
      setIsSendingToBackend(false);
    }
  };

  const removePartImage = () => {
    setFormData((prev) => ({ ...prev, partImage: null }));
    setPartImagePreview(null);
    if (partImageInputRef.current) {
      partImageInputRef.current.value = "";
    }
  };

  const removeRequestImage = () => {
    setFormData((prev) => ({ ...prev, requestImage: null }));
    setRequestImagePreview(null);
    if (requestImageInputRef.current) {
      requestImageInputRef.current.value = "";
    }
  };

  const removeFormImage = () => {
    setFormData((prev) => ({ ...prev, formImage: null }));
    setFormImagePreview(null);
    if (formImageInputRef.current) {
      formImageInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
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

      {/* Main Content Section - Split Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Right Side - Form */}
          <div className="order-1 lg:order-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  نموذج طلب التسعير
                </h2>
                <p className="text-gray-600">
                  املأ النموذج أدناه وسيتم حفظ البيانات على اليسار
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
                {/* User Code Input - Only for Workshop */}
                {userType === "workshop" && (
                  <>
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
                    {/* Part Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        <ImageIcon className="inline ml-2" size={16} />
                        صورة القطعة
                      </label>
                      <div className="space-y-4">
                        <input
                          ref={partImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePartImageChange}
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

                        {/* Part Image Preview */}
                        {partImagePreview && (
                          <div className="relative">
                            <Image
                              src={partImagePreview}
                              alt="معاينة صورة القطعة"
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                              width={100}
                              height={100}
                            />
                            <button
                              type="button"
                              onClick={removePartImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Request Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        <ImageIcon className="inline ml-2" size={16} />
                        صورة الطلب
                      </label>
                      <div className="space-y-4">
                        <input
                          ref={requestImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleRequestImageChange}
                          className="hidden"
                          id="requestImage"
                        />
                        <label
                          htmlFor="requestImage"
                          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                        >
                          <div className="text-center">
                            <Upload
                              className="mx-auto text-gray-400 mb-2"
                              size={24}
                            />
                            <p className="text-sm text-gray-500">
                              اضغط لاختيار صورة الطلب
                            </p>
                            <p className="text-xs text-gray-400">
                              JPG, PNG, GIF حتى 5MB
                            </p>
                          </div>
                        </label>

                        {/* Request Image Preview */}
                        {requestImagePreview && (
                          <div className="relative">
                            <Image
                              src={requestImagePreview}
                              alt="معاينة صورة الطلب"
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                              width={100}
                              height={100}
                            />
                            <button
                              type="button"
                              onClick={removeRequestImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Form Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        <ImageIcon className="inline ml-2" size={16} />
                        صورة الاستمارة
                      </label>
                      <div className="space-y-4">
                        <input
                          ref={formImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFormImageChange}
                          className="hidden"
                          id="formImage"
                        />
                        <label
                          htmlFor="formImage"
                          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                        >
                          <div className="text-center">
                            <Upload
                              className="mx-auto text-gray-400 mb-2"
                              size={24}
                            />
                            <p className="text-sm text-gray-500">
                              اضغط لاختيار صورة الاستمارة
                            </p>
                            <p className="text-xs text-gray-400">
                              JPG, PNG, GIF حتى 5MB
                            </p>
                          </div>
                        </label>

                        {/* Form Image Preview */}
                        {formImagePreview && (
                          <div className="relative">
                            <Image
                              src={formImagePreview}
                              alt="معاينة صورة الاستمارة"
                              className="w-full h-48 object-cover rounded-lg border border-gray-300"
                              width={100}
                              height={100}
                            />
                            <button
                              type="button"
                              onClick={removeFormImage}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>{" "}
                  </>
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
                      // required
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
                        جاري الحفظ...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {savedForms.length > 0
                          ? "إضافة قطعة أخرى"
                          : "حفظ البيانات"}
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
                  <li>
                    • يمكنك إضافة عدة قطع ثم إرسالها جميعاً من الجانب الأيسر
                  </li>
                  <li>• سيتم الرد على طلبك خلال 24 ساعة عمل</li>
                  <li>• تأكد من إرفاق صور واضحة للقطعة والطلب والاستمارة</li>
                  {userType === "workshop" && (
                    <>
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

          {/* Left Side - Saved Data */}
          <div className="order-2 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  البيانات المحفوظة
                </h3>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {savedForms.length} عنصر
                </span>
              </div>

              {savedForms.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 text-lg mb-2">
                    لا توجد بيانات محفوظة
                  </p>
                  <p className="text-gray-400 text-sm">
                    املأ النموذج على اليمين لإضافة البيانات
                  </p>
                </div>
              ) : (
                <>
                  {/* Submit All Button */}
                  <div className="mb-6">
                    <Button
                      onClick={sendAllToBackend}
                      disabled={isSendingToBackend}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
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
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {savedForms.map((form, index) => (
                      <div
                        key={form.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                form.userType === "workshop"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {form.userType === "workshop" ? "ورشة" : "محل"}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              #{index + 1}
                            </span>
                          </div>
                          <button
                            onClick={() => deleteSavedForm(form.id)}
                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title="حذف"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              اسم القطعة:
                            </span>
                            <p className="text-gray-800 font-medium">
                              {form.partName}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-gray-600">
                                الكمية:
                              </span>
                              <p className="text-gray-800 text-sm">
                                {form.quantity}
                              </p>
                            </div>
                            {form.userType === "workshop" && form.userCode && (
                              <div>
                                <span className="text-xs text-gray-600">
                                  كود الورشة:
                                </span>
                                <p className="text-gray-800 text-sm">
                                  {form.userCode}
                                </p>
                              </div>
                            )}
                          </div>

                          {form.userType === "workshop" &&
                            form.chassisNumber && (
                              <div>
                                <span className="text-xs text-gray-600">
                                  رقم الهيكل:
                                </span>
                                <p className="text-gray-800 text-sm">
                                  {form.chassisNumber}
                                </p>
                              </div>
                            )}

                          {/* Images Display */}
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {form.partImagePreview && (
                              <div>
                                <span className="text-xs text-gray-600 block mb-1">
                                  صورة القطعة:
                                </span>
                                <Image
                                  src={form.partImagePreview}
                                  alt="صورة القطعة"
                                  className="w-full h-16 object-cover rounded border border-gray-300"
                                  width={80}
                                  height={64}
                                />
                              </div>
                            )}
                            {form.requestImagePreview && (
                              <div>
                                <span className="text-xs text-gray-600 block mb-1">
                                  صورة الطلب:
                                </span>
                                <Image
                                  src={form.requestImagePreview}
                                  alt="صورة الطلب"
                                  className="w-full h-16 object-cover rounded border border-gray-300"
                                  width={80}
                                  height={64}
                                />
                              </div>
                            )}
                            {form.formImagePreview && (
                              <div>
                                <span className="text-xs text-gray-600 block mb-1">
                                  صورة الاستمارة:
                                </span>
                                <Image
                                  src={form.formImagePreview}
                                  alt="صورة الاستمارة"
                                  className="w-full h-16 object-cover rounded border border-gray-300"
                                  width={80}
                                  height={64}
                                />
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-gray-400 mt-2">
                            تم الحفظ: {form.submittedAt.toLocaleString("ar-EG")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

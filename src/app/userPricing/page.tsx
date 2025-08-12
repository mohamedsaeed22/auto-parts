"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, User, Package, Hash, X } from "lucide-react";
import Image from "next/image";
import { useUserPricingForm } from "@/hooks/useUserPricingForm";
import { UserTypeSelector } from "@/components/userPricing/UserTypeSelector";
import { ImageUpload } from "@/components/userPricing/ImageUpload";
import { FormInput } from "@/components/userPricing/FormInput";
import { UserPricingFormData } from "@/lib/validations/userPricingSchema";

export default function UserPricingPage() {
  const {
    form,
    savedForms,
    partImagePreview,
    requestImagePreview,
    formImagePreview,
    isSubmitting,
    isSendingToBackend,
    handleImageChange,
    removeImage,
    onSubmit,
    deleteSavedForm,
    sendAllToBackend,
  } = useUserPricingForm();

  const partImageInputRef = useRef<HTMLInputElement>(null);
  const requestImageInputRef = useRef<HTMLInputElement>(null);
  const formImageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  const userType = watch("userType");

  const resetImageInputs = () => {
    if (partImageInputRef.current) partImageInputRef.current.value = "";
    if (requestImageInputRef.current) requestImageInputRef.current.value = "";
    if (formImageInputRef.current) formImageInputRef.current.value = "";
  };

  const handleFormSubmit = async (data: UserPricingFormData) => {
    await onSubmit(data);
    resetImageInputs();
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

              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-6"
              >
                {/* User Type Selection */}
                <UserTypeSelector control={control} />

                {/* Part Name Input */}
                <FormInput
                  label="اسم القطعة"
                  icon={Package}
                  placeholder="أدخل اسم القطعة المطلوبة"
                  error={errors.partName?.message}
                  {...register("partName")}
                />

                {/* User Code Input - Only for Workshop */}
                {userType === "workshop" && (
                  <>
                    <FormInput
                      label="كود الورشة"
                      icon={User}
                      placeholder="أدخل كود الورشة الخاص بك"
                      helpText="يمكنك تغيير الكود للحصول على نقاط إضافية"
                      error={errors.userCode?.message}
                      {...register("userCode")}
                    />

                    {/* Part Image Upload */}
                    <ImageUpload
                      ref={partImageInputRef}
                      id="partImage"
                      label="صورة القطعة"
                      preview={partImagePreview}
                      onImageChange={(file) =>
                        handleImageChange(file, "partImage")
                      }
                      onRemoveImage={() => removeImage("partImage")}
                      error={errors.partImage?.message}
                    />

                    {/* Request Image Upload */}
                    <ImageUpload
                      ref={requestImageInputRef}
                      id="requestImage"
                      label="صورة الطلب"
                      preview={requestImagePreview}
                      onImageChange={(file) =>
                        handleImageChange(file, "requestImage")
                      }
                      onRemoveImage={() => removeImage("requestImage")}
                      error={errors.requestImage?.message}
                    />

                    {/* Form Image Upload */}
                    <ImageUpload
                      ref={formImageInputRef}
                      id="formImage"
                      label="صورة الاستمارة"
                      preview={formImagePreview}
                      onImageChange={(file) =>
                        handleImageChange(file, "formImage")
                      }
                      onRemoveImage={() => removeImage("formImage")}
                      error={errors.formImage?.message}
                    />
                  </>
                )}

                {/* Quantity Input */}
                <FormInput
                  label="الكمية"
                  type="number"
                  placeholder="أدخل الكمية المطلوبة"
                  min="1"
                  error={errors.quantity?.message}
                  {...register("quantity")}
                />

                {/* Chassis Number Input - Only for Workshop */}
                {userType === "workshop" && (
                  <FormInput
                    label="رقم الهيكل"
                    icon={Hash}
                    placeholder="أدخل رقم الهيكل"
                    helpText="رقم الهيكل يساعد في تحديد القطعة المناسبة لسيارتك"
                    error={errors.chassisNumber?.message}
                    {...register("chassisNumber")}
                  />
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
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

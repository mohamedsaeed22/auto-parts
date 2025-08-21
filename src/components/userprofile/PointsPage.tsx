"use client";

import { Gift, TrendingUp, History, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PointsPage() {
  const { t, i18n } = useTranslation("userProfile");
  const isRTL = i18n.language === "ar";

  // Mock data - replace with actual user points data
  const userPoints = 1250;
  const pointsHistory = [
    {
      id: 1,
      type: "earned",
      amount: 100,
      description: isRTL ? "شراء منتج" : "Product Purchase",
      date: "2024-01-15",
      orderId: "#12345",
    },
    {
      id: 2,
      type: "redeemed",
      amount: -50,
      description: isRTL ? "استبدال قسيمة خصم" : "Discount Voucher Redemption",
      date: "2024-01-10",
      orderId: "#12340",
    },
    {
      id: 3,
      type: "earned",
      amount: 200,
      description: isRTL ? "مراجعة منتج" : "Product Review",
      date: "2024-01-05",
      orderId: "#12335",
    },
    {
      id: 4,
      type: "earned",
      amount: 150,
      description: isRTL ? "شراء منتج" : "Product Purchase",
      date: "2024-01-01",
      orderId: "#12330",
    },
  ];

  const availableRewards = [
    {
      id: 1,
      name: isRTL ? "قسيمة خصم 10%" : "10% Discount Voucher",
      pointsRequired: 500,
      description: isRTL
        ? "خصم 10% على الطلب التالي"
        : "10% discount on next order",
      icon: <Gift size={24} className="text-yellow-500" />,
    },
    {
      id: 2,
      name: isRTL ? "شحن مجاني" : "Free Shipping",
      pointsRequired: 300,
      description: isRTL
        ? "شحن مجاني للطلب التالي"
        : "Free shipping on next order",
      icon: <TrendingUp size={24} className="text-green-500" />,
    },
    {
      id: 3,
      name: isRTL ? "قسيمة خصم 20%" : "20% Discount Voucher",
      pointsRequired: 1000,
      description: isRTL
        ? "خصم 20% على الطلب التالي"
        : "20% discount on next order",
      icon: <Star size={24} className="text-purple-500" />,
    },
  ];

  return (
    <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("points.title")}
        </h1>
        <p className="text-gray-600">{t("points.description")}</p>
      </div>

      {/* Points Summary */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 mb-8 text-white">
        <div
          className={`flex items-center justify-between ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className={isRTL ? "text-right" : "text-left"}>
            <h2 className="text-lg font-semibold mb-1">
              {t("points.totalPoints")}
            </h2>
            <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
          </div>
          <div className={isRTL ? "text-left" : "text-right"}>
            <p className="text-yellow-100 text-sm">
              {t("points.availableForRedemption")}
            </p>
            <p className="text-lg font-semibold">
              {isRTL ? "للاستبدال" : "Available"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Rewards */}
        <div>
          <h3
            className={`text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Gift size={20} />
            {t("points.availableRewards")}
          </h3>
          <div className="space-y-4">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className={`border rounded-lg p-4 ${
                  userPoints >= reward.pointsRequired
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div
                  className={`flex items-start justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    {reward.icon}
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <h4 className="font-medium text-gray-900">
                        {reward.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                  <div className={isRTL ? "text-left" : "text-right"}>
                    <p className="text-sm font-medium text-gray-900">
                      {reward.pointsRequired} {isRTL ? "نقطة" : "points"}
                    </p>
                    <button
                      className={`mt-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        userPoints >= reward.pointsRequired
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={userPoints < reward.pointsRequired}
                    >
                      {userPoints >= reward.pointsRequired
                        ? t("points.redeem")
                        : t("points.notEnoughPoints")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div>
          <h3
            className={`text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <History size={20} />
            {t("points.pointsHistory")}
          </h3>
          <div className="space-y-3">
            {pointsHistory.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div
                  className={`flex items-center justify-between ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString(
                        isRTL ? "ar-SA" : "en-US"
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isRTL ? "طلب: " : "Order: "}
                      {transaction.orderId}
                    </p>
                  </div>
                  <div className={isRTL ? "text-left" : "text-right"}>
                    <p
                      className={`font-semibold ${
                        transaction.type === "earned"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "earned" ? "+" : ""}
                      {transaction.amount} {isRTL ? "نقطة" : "points"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div
        className={`mt-8 bg-blue-50 rounded-lg p-6 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isRTL ? "كيف تكسب نقاط أكثر؟" : "How to earn more points?"}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isRTL ? "الشراء" : "Purchase"}
              </p>
              <p className="text-sm text-gray-600">
                {isRTL ? "10 نقاط لكل ريال" : "10 points per SAR"}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isRTL ? "مراجعة المنتجات" : "Product Reviews"}
              </p>
              <p className="text-sm text-gray-600">
                {isRTL ? "50 نقطة لكل مراجعة" : "50 points per review"}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {isRTL ? "الإحالة" : "Referral"}
              </p>
              <p className="text-sm text-gray-600">
                {isRTL ? "100 نقطة لكل صديق" : "100 points per friend"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

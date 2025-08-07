"use client";

import { Gift, TrendingUp, History, Star } from "lucide-react";

export default function PointsPage() {
  // Mock data - replace with actual user points data
  const userPoints = 1250;
  const pointsHistory = [
    {
      id: 1,
      type: "earned",
      amount: 100,
      description: "شراء منتج",
      date: "2024-01-15",
      orderId: "#12345",
    },
    {
      id: 2,
      type: "redeemed",
      amount: -50,
      description: "استبدال قسيمة خصم",
      date: "2024-01-10",
      orderId: "#12340",
    },
    {
      id: 3,
      type: "earned",
      amount: 200,
      description: "مراجعة منتج",
      date: "2024-01-05",
      orderId: "#12335",
    },
    {
      id: 4,
      type: "earned",
      amount: 150,
      description: "شراء منتج",
      date: "2024-01-01",
      orderId: "#12330",
    },
  ];

  const availableRewards = [
    {
      id: 1,
      name: "قسيمة خصم 10%",
      pointsRequired: 500,
      description: "خصم 10% على الطلب التالي",
      icon: <Gift size={24} className="text-yellow-500" />,
    },
    {
      id: 2,
      name: "شحن مجاني",
      pointsRequired: 300,
      description: "شحن مجاني للطلب التالي",
      icon: <TrendingUp size={24} className="text-green-500" />,
    },
    {
      id: 3,
      name: "قسيمة خصم 20%",
      pointsRequired: 1000,
      description: "خصم 20% على الطلب التالي",
      icon: <Star size={24} className="text-purple-500" />,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">نقاطي</h1>
        <p className="text-gray-600">تابع نقاطك واستبدلها بمكافآت رائعة</p>
      </div>

      {/* Points Summary */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">إجمالي النقاط</h2>
            <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-yellow-100 text-sm">النقاط المتاحة</p>
            <p className="text-lg font-semibold">للاستبدال</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Rewards */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gift size={20} />
            المكافآت المتاحة
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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {reward.icon}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {reward.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {reward.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {reward.pointsRequired} نقطة
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
                        ? "استبدال"
                        : "نقاط غير كافية"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History size={20} />
            سجل النقاط
          </h3>
          <div className="space-y-3">
            {pointsHistory.map((transaction) => (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString("ar-SA")}
                    </p>
                    <p className="text-xs text-gray-400">
                      طلب: {transaction.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "earned"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "earned" ? "+" : ""}
                      {transaction.amount} نقطة
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          كيف تكسب نقاط أكثر؟
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">الشراء</p>
              <p className="text-sm text-gray-600">10 نقاط لكل ريال</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">مراجعة المنتجات</p>
              <p className="text-sm text-gray-600">50 نقطة لكل مراجعة</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">الإحالة</p>
              <p className="text-sm text-gray-600">100 نقطة لكل صديق</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

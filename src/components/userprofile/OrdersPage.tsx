"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  trackingNumber?: string;
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 299.99,
      items: [
        {
          id: 1,
          name: "فرامل عالية الأداء",
          price: 89.99,
          quantity: 2,
          image: "/products/product1.jpg",
        },
        {
          id: 2,
          name: "زيت محرك اصطناعي",
          price: 120.01,
          quantity: 1,
          image: "/products/product2.jpg",
        },
      ],
      trackingNumber: "TRK123456789",
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-20",
      status: "shipped",
      total: 450.0,
      items: [
        {
          id: 3,
          name: "فلتر هواء محرك",
          price: 150.0,
          quantity: 3,
          image: "/products/product3.png",
        },
      ],
      trackingNumber: "TRK987654321",
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-25",
      status: "processing",
      total: 199.99,
      items: [
        {
          id: 4,
          name: "شمعة اشتعال",
          price: 199.99,
          quantity: 1,
          image: "/products/product4.png",
        },
      ],
    },
  ]);

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          text: "في الانتظار",
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          icon: Clock,
        };
      case "processing":
        return {
          text: "قيد المعالجة",
          color: "text-blue-600",
          bg: "bg-blue-100",
          icon: Package,
        };
      case "shipped":
        return {
          text: "تم الشحن",
          color: "text-purple-600",
          bg: "bg-purple-100",
          icon: Truck,
        };
      case "delivered":
        return {
          text: "تم التوصيل",
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          text: "ملغي",
          color: "text-red-600",
          bg: "bg-red-100",
          icon: Clock,
        };
    }
  };

  const handleReorder = (order: Order) => {
    // Add to cart logic would go here
    console.log("Reorder:", order);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-right">الطلبات</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            تصدير
          </Button>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {orders.length}
          </div>
          <div className="text-sm text-gray-600">إجمالي الطلبات</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === "delivered").length}
          </div>
          <div className="text-sm text-gray-600">تم التوصيل</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {
              orders.filter(
                (o) => o.status === "processing" || o.status === "shipped"
              ).length
            }
          </div>
          <div className="text-sm text-gray-600">قيد التوصيل</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">إجمالي الإنفاق</div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye size={14} />
                    تفاصيل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-2"
                  >
                    إعادة طلب
                  </Button>
                </div>
                <div className="text-right">
                  <div className="font-medium text-lg">{order.id}</div>
                  <div className="text-sm text-gray-600">{order.date}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">الحالة</div>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}
                  >
                    <StatusIcon size={14} />
                    {statusInfo.text}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">إجمالي الطلب</div>
                  <div className="font-medium">{order.total} ريال</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">عدد المنتجات</div>
                  <div className="font-medium">{order.items.length} منتج</div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 text-right">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        الكمية: {item.quantity} × {item.price} ريال
                      </div>
                    </div>
                    <div className="font-medium">
                      {(item.quantity * item.price).toFixed(2)} ريال
                    </div>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">رقم التتبع</div>
                  <div className="font-mono text-blue-600">
                    {order.trackingNumber}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

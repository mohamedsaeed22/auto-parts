"use client";

import { useState } from "react";
import { Search, Filter, CarFront, Package, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function PricingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const brands = [
    { id: "toyota", name: "تويوتا", logo: "🚗" },
    { id: "honda", name: "هوندا", logo: "🚗" },
    { id: "bmw", name: "بي إم دبليو", logo: "🚗" },
    { id: "mercedes", name: "مرسيدس", logo: "🏁" },
    { id: "audi", name: "أودي", logo: "🚘" },
    { id: "nissan", name: "نيسان", logo: "🚗" },
  ];

  const categories = [
    { id: "engine", name: "محرك", icon: "⚙️" },
    { id: "brakes", name: "فرامل", icon: "🛑" },
    { id: "suspension", name: "تعليق", icon: "🔧" },
    { id: "electrical", name: "كهرباء", icon: "⚡" },
    { id: "body", name: "هيكل", icon: "🚗" },
    { id: "interior", name: "داخلي", icon: "💺" },
  ];

  const sampleParts = [
    {
      id: 1,
      name: "فلتر زيت المحرك",
      brand: "تويوتا",
      category: "محرك",
      price: 45,
      originalPrice: 60,
      reviews: 128,
      image: "/products/product1.jpg",
      availability: "متوفر",
      deliveryTime: "1-2 يوم",
    },
    {
      id: 2,
      name: "بطانة الفرامل الأمامية",
      brand: "هوندا",
      category: "فرامل",
      price: 85,
      originalPrice: 120,
      reviews: 89,
      image: "/products/product2.jpg",
      availability: "متوفر",
      deliveryTime: "2-3 يوم",
    },
    {
      id: 3,
      name: "شمعة الإشعال",
      brand: "بي إم دبليو",
      category: "محرك",
      price: 35,
      originalPrice: 50,
      reviews: 156,
      image: "/products/product3.png",
      availability: "متوفر",
      deliveryTime: "1 يوم",
    },
    {
      id: 4,
      name: "مضخة الماء",
      brand: "مرسيدس",
      category: "محرك",
      price: 120,
      originalPrice: 180,
      reviews: 67,
      image: "/products/product4.png",
      availability: "متوفر",
      deliveryTime: "3-4 يوم",
    },
    {
      id: 5,
      name: "مصباح أمامي",
      brand: "أودي",
      category: "كهرباء",
      price: 95,
      originalPrice: 140,
      reviews: 43,
      image: "/products/product5.png",
      availability: "متوفر",
      deliveryTime: "2 يوم",
    },
    {
      id: 6,
      name: "مقعد السائق",
      brand: "نيسان",
      category: "داخلي",
      price: 250,
      originalPrice: 350,
      reviews: 78,
      image: "/products/product6.png",
      availability: "متوفر",
      deliveryTime: "4-5 يوم",
    },
  ];

  const filteredParts = sampleParts.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand =
      selectedBrand === "all" ||
      part.brand === brands.find((b) => b.id === selectedBrand)?.name;
    const matchesCategory =
      selectedCategory === "all" ||
      part.category === categories.find((c) => c.id === selectedCategory)?.name;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#b9974d] to-[#b9974d] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">جميع القطع</h1>
            <p className="text-xl text-blue-100 mb-8">
              ابحث عن قطع السيارات واحصل على أفضل الأسعار
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative border border-white rounded-lg">
                <Search
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white "
                  size={20}
                />
                <input
                  type="text"
                  placeholder="ابحث عن قطع السيارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-12 py-4 rounded-lg text-white text-right placeholder:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                الفلاتر
              </h3>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">البراند</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                >
                  <option value="all">جميع البراندات</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.logo} {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">الفئة</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                >
                  <option value="all">جميع الفئات</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">نطاق السعر</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="ml-2" />
                    <span className="text-sm">أقل من 50 ريال</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="ml-2" />
                    <span className="text-sm">50 - 100 ريال</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="ml-2" />
                    <span className="text-sm">100 - 200 ريال</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="ml-2" />
                    <span className="text-sm">أكثر من 200 ريال</span>
                  </label>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Filter className="ml-2" size={16} />
                تطبيق الفلاتر
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                النتائج ({filteredParts.length})
              </h2>
              <select className="p-2 border border-gray-300 rounded-md text-right">
                <option>ترتيب حسب: الأحدث</option>
                <option>ترتيب حسب: السعر (من الأقل)</option>
                <option>ترتيب حسب: السعر (من الأعلى)</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParts.map((part) => (
                <div
                  key={part.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={part.image}
                      alt={part.name}
                      width={100}
                      height={100}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      {Math.round(
                        ((part.originalPrice - part.price) /
                          part.originalPrice) *
                          100
                      )}
                      % خصم
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {part.brand}
                      </span>
                      <span className="text-sm text-gray-500">
                        {part.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2 text-right">
                      {part.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">
                          {part.price} ريال
                        </span>
                        <span className="text-sm text-gray-400 line-through mr-2">
                          {part.originalPrice} ريال
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Package size={14} className="ml-1" />
                        <span>{part.availability}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="ml-1" />
                        <span>{part.deliveryTime}</span>
                      </div>
                    </div>

                    <Button className="w-full">
                      <CarFront className="ml-2" size={16} />
                      إضافة للسلة
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2 space-x-reverse">
                <Button variant="outline" size="sm">
                  السابق
                </Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  التالي
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

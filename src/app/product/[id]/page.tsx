import Image from "next/image";
import { Star, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const product = {
  id: 1,
  title: "فرامل عالية الأداء",
  price: 89.99,
  description:
    "وسائد فرامل ممتازة مصممة للمركبات عالية الأداء. تتميز بمواد احتكاك متقدمة لقوة توقف فائقة وتقليل تلاشي الفرامل. مثالية للسيارات الرياضية والتطبيقات الشاقة.",
  category: "الفرامل",
  image: "/offers/offer1.jpg",
  rating: {
    rate: 4.5,
    count: 128,
  },
  images: [
    "/products/product1.jpg",
    "/products/product1.jpg",
    "/products/product1.jpg",
    "/products/product1.jpg",
  ],
};

export default function ProductDetails() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8  ">
        <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors flex-row-reverse space-x-reverse">
          <span>رجوع</span>
          <ArrowRight size={16} />
        </button>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                  index === 0 ? "border-gray-900" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-2xl font-bold text-gray-900">
              {product.price} ر.س
            </p>
          </div>

          {/* Rating */}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">الوصف</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Category */}
          <div>
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm capitalize">
              {product.category}
            </span>
          </div>

          {/* Quantity Selector (static) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الكمية
            </label>
            <div className="flex items-center space-x-3 flex-row-reverse space-x-reverse">
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
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
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="text-xl font-semibold w-12 text-center">1</span>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              className="w-full flex items-center justify-center space-x-2 flex-row-reverse space-x-reverse"
              size="lg"
            >
              <ShoppingCart size={20} />
              <span>أضف إلى السلة</span>
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 flex-row-reverse space-x-reverse"
              size="lg"
            >
              <span>أضف إلى المفضلة</span>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">رمز المنتج:</span>
              <span className="text-sm font-medium">PRD-{product.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">التوفر:</span>
              <span className="text-sm font-medium text-green-600">متوفر</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">القسم:</span>
              <span className="text-sm font-medium capitalize">
                {product.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

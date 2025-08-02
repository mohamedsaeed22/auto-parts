"use client";
import React from "react";
import Image from "next/image";

const Brands = () => {
  // Sample car brands - you can replace these with actual brand logos
  const brands = [
    {
      id: 1,
      name: "مرسيدس",
      logo: "/brands/brand1.png", // You'll need to add these images
    },
    {
      id: 2,
      name: "بي إم دبليو",
      logo: "/brands/brand2.png",
    },
    {
      id: 3,
      name: "أودي",
      logo: "/brands/brand3.png",
    },
    {
      id: 4,
      name: "تويوتا",
      logo: "/brands/brand4.png",
    },
    {
      id: 5,
      name: "هوندا",
      logo: "/brands/brand5.png",
    },
    {
      id: 6,
      name: "فورد",
      logo: "/brands/brand6.png",
    },
    {
      id: 7,
      name: "فولكس فاجن",
      logo: "/brands/brand7.png",
    },
    {
      id: 8,
      name: "نيسان",
      logo: "/brands/brand8.png",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            علاماتنا التجارية الموثوقة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نحن نعمل مع أشهر العلامات التجارية في مجال السيارات لتقديم أفضل قطع
            الغيار والإكسسوارات عالية الجودة لسيارتك
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group relative flex flex-col items-center"
            >
              {/* Background circle with brand-bg.png */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/brands/brand-bg.png"
                  alt={`خلفية ${brand.name}`}
                  fill
                  className="object-cover"
                />

                {/* Brand logo overlay */}
                <div className="absolute inset-0 flex items-center justify-center  duration-300">
                  <div className="w-12 h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 relative">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Brand name */}
              <p className="mt-3 text-sm md:text-base font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Brands;

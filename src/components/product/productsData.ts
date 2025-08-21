export interface Product {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  category: {
    ar: string;
    en: string;
  };
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    title: {
      ar: "فرامل عالية الأداء للسيارات الرياضية",
      en: "High Performance Brakes for Sports Cars",
    },
    price: 89.99,
    category: {
      ar: "الفرامل",
      en: "Brakes",
    },
    image: "/products/product1.jpg",
  },
  {
    id: 2,
    title: {
      ar: "زيت محرك اصطناعي عالي الجودة",
      en: "High Quality Synthetic Engine Oil",
    },
    price: 45.5,
    category: {
      ar: "الزيوت",
      en: "Oils",
    },
    image: "/products/product2.jpg",
  },
  {
    id: 3,
    title: {
      ar: "فلتر هواء محرك قابل للغسل",
      en: "Washable Engine Air Filter",
    },
    price: 32.75,
    category: {
      ar: "الفلترة",
      en: "Filters",
    },
    image: "/products/product3.png",
  },
  {
    id: 4,
    title: {
      ar: "بطارية سيارة قوية 60 أمبير",
      en: "Powerful 60 Amp Car Battery",
    },
    price: 120.0,
    category: {
      ar: "البطاريات",
      en: "Batteries",
    },
    image: "/products/product4.png",
  },
  {
    id: 5,
    title: {
      ar: "إطارات صيفية عالية الأداء",
      en: "High Performance Summer Tires",
    },
    price: 180.25,
    category: {
      ar: "الإطارات",
      en: "Tires",
    },
    image: "/products/product5.png",
  },
  {
    id: 6,
    title: {
      ar: "مصباح LED أمامي للسيارة",
      en: "LED Headlight for Car",
    },
    price: 65.8,
    category: {
      ar: "الإضاءة",
      en: "Lighting",
    },
    image: "/products/product6.png",
  },
  {
    id: 7,
    title: {
      ar: "مقعد سيارة رياضي قابل للتعديل",
      en: "Adjustable Sports Car Seat",
    },
    price: 250.0,
    category: {
      ar: "المقاعد",
      en: "Seats",
    },
    image: "/products/product7.png",
  },
  {
    id: 8,
    title: {
      ar: "عجلة قيادة رياضية جلدية",
      en: "Leather Sports Steering Wheel",
    },
    price: 95.5,
    category: {
      ar: "الإكسسوارات",
      en: "Accessories",
    },
    image: "/products/product8.jpg",
  },
  {
    id: 9,
    title: {
      ar: "مكيف هواء محمول للسيارة",
      en: "Portable Car Air Conditioner",
    },
    price: 75.3,
    category: {
      ar: "التكييف",
      en: "Air Conditioning",
    },
    image: "/products/product9.jpg",
  },
  {
    id: 10,
    title: {
      ar: "جهاز تتبع GPS للسيارة",
      en: "GPS Tracking Device for Car",
    },
    price: 110.0,
    category: {
      ar: "الإلكترونيات",
      en: "Electronics",
    },
    image: "/products/product10.png",
  },
];

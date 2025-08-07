import SwiperCarousel from "@/components/Swiper";
import Brands from "@/components/Brands";
import PackagesOffers from "@/components/PackagesOffers";
import ProductsList from "@/components/product/ProductsList";
import Category from "@/components/Category";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen mt-10">
        <div className="container mx-auto">
          <SwiperCarousel />
          <Brands />
          <PackagesOffers />

          {/* Example Category Section */}
          <Category
            title="قطع غيار المحرك"
            // description="اكتشف مجموعة واسعة من قطع غيار المحرك عالية الجودة لضمان أداء مثالي لسيارتك"
            backgroundImage="/categories/cat-bg-1.jpg"
            // categoryFilter="الفرامل"
          />

          <ProductsList />
          {/* You can add more category sections */}
          <Category
            title="الزيوت والمواد التشحيم"
            // description="زيوت محرك عالية الجودة ومواد تشحيم متقدمة لحماية محرك سيارتك"
            backgroundImage="/categories/cat-bg-2.jpg"
            // categoryFilter="الزيوت"
          />
        </div>
      </main>
    </div>
  );
}

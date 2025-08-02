import Header from "@/components/Header";
import SwiperCarousel from "@/components/Swiper";
import Brands from "@/components/Brands";

export default function Home() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <main className="min-h-screen container mx-auto mt-5">
        <SwiperCarousel />
        <Brands />
      </main>
    </div>
  );
}

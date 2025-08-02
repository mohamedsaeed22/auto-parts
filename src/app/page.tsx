import Header from "@/components/Header";
import SwiperCarousel from "@/components/Swiper";
import Brands from "@/components/Brands";
import PackagesOffers from "@/components/PackagesOffers";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <main className="min-h-screen">
        <div className="container mx-auto">
          <SwiperCarousel />
          <Brands />
          <PackagesOffers />
        </div>
      </main>
      <Footer />
    </div>
  );
}

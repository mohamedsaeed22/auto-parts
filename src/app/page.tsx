 import SwiperCarousel from "@/components/Swiper";
import Brands from "@/components/Brands";
import PackagesOffers from "@/components/PackagesOffers";
import ProductsList from "@/components/ProductsList";
import ProductCardWithQuantity from "@/components/ProductCardWithQuantity";
 
export default function Home() {
  return (
    <div>
       <main className="min-h-screen mt-10">
        <div className="container mx-auto">
          <SwiperCarousel />
          <Brands />
          <PackagesOffers />
          <ProductsList />
          {/* <ProductCardWithQuantity /> */}
        </div>
      </main>
    </div>
  );
}

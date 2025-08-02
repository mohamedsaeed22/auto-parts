import Header from "@/components/Header";
import SwiperCarousel from "@/components/Swiper";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="container mx-auto mt-8">
        <SwiperCarousel />
      </div>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer> */}
    </div>
  );
}

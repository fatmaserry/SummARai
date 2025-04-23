import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

import slide_image_1 from "/assets/images/الساموراي.png";
import slide_image_2 from "/assets/images/الاثار الاسلامية.png";
import slide_image_3 from "/assets/images/الفرزدق.png";
import slide_image_4 from "/assets/images/الهجرة_إلى_الإنسانية.png";
import slide_image_5 from "/assets/images/مصر و الشام.png";

export default function HomePage() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg xl:text-3xl font-semibold text-white">مكتبة SummARai لتلخيص الكتب العربية</h3>
        <h3 className="text-lg xl:text-3xl font-semibold text-white">اكثر من الف كتاب تم تلخيصهم بدقة بواسطة الذكاء الاصطناعي</h3>
      </div>

      <div className="w-full h-full max-w-4xl mx-auto mt-6 relative">
        <div ref={prevRef} className="swiper-button-prev absolute -left-12 bottom-0 transform z-10">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </div>
        <div ref={nextRef} className="swiper-button-next absolute -right-12 bottom-0 transform z-10">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          spaceBetween={10}
          modules={[EffectCoverflow, Navigation]}
          className="swiper_container"
        >
          {[slide_image_1, slide_image_2, slide_image_3, slide_image_4, slide_image_5].map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`slide_image_${idx + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

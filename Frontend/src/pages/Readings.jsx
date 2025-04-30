import React from "react";
import DropFileInput from "../components/DropFileInput.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import slide_image_1 from "/assets/images/الساموراي.png";

export default function Readings() {
  
  return (
    <>
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        اضِف قراءات جديدة
      </h2>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="box w-full max-w-md">
          <div className="border-2 border-dashed border-[#765CDE] rounded-xl p-6 text-center text-white">
            <DropFileInput
              onFileChange={(files) => onFileChange(files)}
              multiple={false}
            />
          </div>
          <button className="mt-4 bg-[#765CDE] text-white py-1.5 px-4 rounded-md text-sm mx-auto block">
            لخص
          </button>
        </div>
      </div>
      <div className="Continue_reading_swiper mt-20 mb-16">
          <h4 className="text-lg font-semibold text-white text-right m-4">
          تابع قراءة
          </h4>
          <Swiper
            // onSwiper={setSwiperRef}
            onSwiper={(swiper) => {
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            slidesPerView={4}
            spaceBetween={5}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper swiper_small"
          >
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="finished_reading_swiper mt-20 mb-16">
          <h4 className="text-lg font-semibold text-white text-right m-4">
          تم الانتهاء منه
          </h4>
          <Swiper
            // onSwiper={setSwiperRef}
            onSwiper={(swiper) => {
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            slidesPerView={4}
            spaceBetween={5}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper swiper_small"
          >
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
            <SwiperSlide>
              <img src={slide_image_1} />
            </SwiperSlide>
          </Swiper>
        </div>
    </>
  );
}

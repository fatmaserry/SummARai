import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const SummarySlider = ({ title, images, className }) => {
  
  return (
    <div className={`${className} mb-16`}>
      <h4 className="text-xl font-semibold text-white text-right m-4">
        {title}
      </h4>
      <Swiper
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
        {images.map((imgSrc, idx) => (
          <SwiperSlide key={idx}>
            <img src={imgSrc} alt={`slide-${idx}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SummarySlider;

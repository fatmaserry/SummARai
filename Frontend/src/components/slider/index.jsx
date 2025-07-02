import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

const SummarySlider = ({ title, images, className, books, onImageClick, type }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className={`${className} mb-16 relative`}>
      <h4 className="text-3xl font-semibold text-white text-right m-4">
        {title}
      </h4>

      {/* Custom arrows */}
      <div className="absolute top-1/2 -left-6 z-10 -translate-y-1/2" ref={prevRef}>
        <img
          src="/assets/images/sword.png"
          alt="prev"
          width={60}
          height={100}
          className="transform rotate-[-135deg] hover:animate-prev hover:cursor-pointer"
        />
      </div>
      <div className="absolute top-1/2 -right-6 z-10 -translate-y-1/2" ref={nextRef}>
        <img
          src="/assets/images/sword.png"
          alt="next"
          width={60}
          height={100}
          className="transform rotate-[45deg] hover:animate-next hover:cursor-pointer"
        />
      </div>

      <Swiper
        modules={[Navigation]}
        slidesPerView={4}
        spaceBetween={5}
        onInit={(swiper) => {
          // Connect custom arrows
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        className="mySwiper swiper_small !w-[83%]"
      >
        {images.map((imgSrc, idx) => (
          <SwiperSlide
            className="!shadow-none !box-shadow-none !drop-shadow-none md:!w-48 md:!h-64 mx-4"
            key={idx}
          >
            <img
              src={imgSrc}
              alt={`slide-${idx}`}
              onClick={() => onImageClick(type === "home" ? books[idx] : books[idx].summaryDto)}
              style={{
                cursor: "pointer",
                boxShadow: "none",
                filter: "drop-shadow(0 0 transparent)"
              }}
              className="w-full rounded object-cover [box-shadow:none] [filter:none]"
            />
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
};

export default SummarySlider;

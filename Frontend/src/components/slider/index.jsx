import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

const SummarySlider = ({ title, images, className, books, onImageClick, type }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className={`${className} mb-16 relative w-[300px] md:w-[600px] lg:w-full`}>
      {title && <h4 className="text-3xl font-semibold text-white text-right m-4">
        {title}
      </h4>}

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
        slidesPerView={1}
        spaceBetween={10}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        breakpoints={{
          640: {
            slidesPerView: 1, // 1 slide on small tablets
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2, // 2 slides on tablets
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3, // 3 slides on laptops
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4, // 4 slides on desktops
            spaceBetween: 24,
          }
        }}
        loop={true}
        className="px-4 !w-[80%]"
      >
        {images.map((imgSrc, idx) => {
          const slideTitle =
            type === "home" ? books[idx]?.title :
              type === "summary" ? books[idx]?.title :
                books[idx]?.summaryDto?.title;


          return (
            <SwiperSlide
              key={idx}
              className="!h-64 bg-white !w-fit !rounded-lg"
            >
              <div
                className="relative w-full h-full rounded overflow-hidden cursor-pointer"
                aria-label={slideTitle}
                onClick={() => onImageClick(type === "home" ? books[idx] : type === "summary" ? books[idx] : books[idx].summaryDto)}
              >
                <img
                  src={imgSrc}
                  alt={slideTitle || `slide-${idx}`}
                  className="w-full h-full object-cover rounded"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                  <p className="text-white text-lg font-semibold px-2 text-center select-none">
                    {slideTitle}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

      </Swiper>
    </div>
  );
};

export default SummarySlider;

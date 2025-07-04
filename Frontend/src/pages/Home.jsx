import React, { useContext, useRef, useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { AuthContext } from "../provider/auth/authProvider";
import { fetchAllBooks, getAllGenres } from "../api/summary/get-summaries.ts";
import SummarySlider from "../components/slider/index.jsx";
import slide_image_1 from "/assets/images/الساموراي.png";
import slide_image_2 from "/assets/images/الاثار الاسلامية.png";
import slide_image_3 from "/assets/images/الفرزدق.png";
import slide_image_4 from "/assets/images/الهجرة_إلى_الإنسانية.png";
import slide_image_5 from "/assets/images/مصر و الشام.png";
import slide_image_6 from "/assets/images/6.jpg";
import { useNavigate } from "react-router-dom";
import WelcomeMessage from "../components/welcome-message/index.tsx";
import UploadSummary from "../components/generate-summary/index.tsx";

// Skeleton Loader Component
const SummarySliderSkeleton = () => (
  <div className="mb-16 relative">
    <div className="h-12 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
    <div className="flex gap-6 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-64 w-48 bg-gray-700 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

export default function HomePage() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [groupedBooks, setGroupedBooks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const slides = useMemo(() => [
    slide_image_2,
    slide_image_3,
    slide_image_4,
    slide_image_5,
    slide_image_6,
    slide_image_1,
  ], []);

  const duplicatedSlides = useMemo(() => [...slides, ...slides, ...slides], [slides]);

  const handleImageClick = (book) => {
    navigate("/summary", { state: { book } });
  };

  // useEffect(() => {
  //   let isMounted = true;
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       const [books, genres] = await Promise.all([
  //         fetchAllBooks(),
  //         getAllGenres(),
  //       ]);

  //       if (isMounted) {
  //         const grouped = {};
  //         books.forEach((book) => {
  //           book.genres.forEach((genreObj) => {
  //             const genreName = genreObj.description;
  //             if (!grouped[genreName]) {
  //               grouped[genreName] = [];
  //             }
  //             grouped[genreName].push(book);
  //           });
  //         });
  //         setGroupedBooks(grouped);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch books or genres:", err);
  //     } finally {
  //       if (isMounted) {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchData();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const renderSummaries = useMemo(() => {
    if (isLoading) {
      return (
        <div className="max-w-7xl mx-auto flex flex-col w-full">
          <h3 className="text-3xl font-semibold text-white text-center mt-12 mb-8">
            القي نظرة على ملخصاتنا
          </h3>
          {[...Array(3)].map((_, idx) => (
            <SummarySliderSkeleton key={idx} />
          ))}
        </div>
      );
    }

    if (!groupedBooks) return null;
    return (
      <div className="max-w-7xl mx-auto flex flex-col w-full items-center md:items-start">
        <h3 className="text-3xl font-semibold text-white text-center mt-12 mb-8">
          القي نظرة على ملخصاتنا
        </h3>
        {Object.entries(groupedBooks)
          .filter(([_, books]) => books.length > 0)
          .map(([genre, books], idx) => (
            <SummarySlider
              key={`${genre}-${idx}`}
              title={`ملخصات ${genre}`}
              images={books.map((book) => book.image_url)}
              books={books}
              onImageClick={handleImageClick}
              type="home"
            />
          ))}
      </div>
    );
  }, [groupedBooks, isLoading, handleImageClick]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-7">
      <WelcomeMessage />
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-semibold text-white">
          مكتبة SummARai لتلخيص الكتب العربية
        </h3>
        <h3 className="text-4xl font-semibold text-white">
          اكثر من الف كتاب تم تلخيصهم بدقة بواسطة الذكاء الاصطناعي
        </h3>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-6 mb-16 relative">
        <div
          ref={prevRef}
          className="absolute -left-28 top-1/2 transform -translate-y-1/2 z-10"
        >
          <img
            src="/assets/images/sword.png"
            alt="prev"
            width={90}
            height={200}
            className="transform rotate-[-135deg] hover:animate-prev hover:cursor-pointer"
            loading="lazy"
          />
        </div>
        <div
          ref={nextRef}
          className="absolute -right-[6.5rem] top-1/2 transform -translate-y-1/2 z-10"
        >
          <img
            src="/assets/images/sword.png"
            alt="next"
            width={90}
            height={200}
            className="transform rotate-[45deg] hover:animate-next hover:cursor-pointer"
            loading="lazy"
          />
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
          loop={true}
          slidesPerView={"auto"}
          spaceBetween={0}
          modules={[EffectCoverflow, Navigation]}
          className="swiper_container"
        >
          {duplicatedSlides.map((img, idx) => (
            <SwiperSlide
              key={idx}
              className="!w-[300px] !h-[300px] flex items-center justify-center"
            >
              <img
                src={img}
                alt={`slide-${idx}`}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isLoggedIn && <UploadSummary />}

      {/* {renderSummaries} */}
    </div>
  );
}
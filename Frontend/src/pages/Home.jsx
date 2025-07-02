import React, { useContext, useRef, useState, useEffect } from "react";
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
import UploadSummary from "../components/upload-summary/index.tsx";

let cachedGroupedBooks = null;

export default function HomePage() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [groupedBooks, setGroupedBooks] = useState({});
  const navigate = useNavigate();

  const handleImageClick = (book) => {
    navigate("/summary", { state: { book } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [books, genres] = await Promise.all([
          fetchAllBooks(),
          getAllGenres(),
        ]);
        const grouped = {};
        books.forEach((book) => {
          book.genres.forEach((genreObj) => {
            const genreName = genreObj.description;
            if (!grouped[genreName]) {
              grouped[genreName] = [];
            }
            grouped[genreName].push(book);
          });
        });
        cachedGroupedBooks = grouped;
        setGroupedBooks(grouped);
      } catch (err) {
        console.error("Failed to fetch books or genres:", err);
      }
    };
    if (cachedGroupedBooks) {
      setGroupedBooks(cachedGroupedBooks);
      return;
    }
    fetchData();
  }, []);

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

      <div className="w-full max-w-4xl mx-auto mt-6 mb-16 relative">
        <div
          ref={prevRef}
          className="absolute -left-28 top-1/2 transform -translate-y-1/2 z-10"
        >
          <img src="/assets/images/sword.png" alt="prev" width={90} height={200} className="transform rotate-[-135deg] hover:animate-prev hover:cursor-pointer" />
          {/* <ion-icon name="arrow-back-outline"></ion-icon> */}
        </div>
        <div
          ref={nextRef}
          className="absolute -right-[6.5rem] top-1/2 transform -translate-y-1/2 z-10"
        >
          <img src="/assets/images/sword.png" alt="next" width={90} height={200} className="transform rotate-[45deg] hover:animate-next hover:cursor-pointer" />
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
          {[
            slide_image_1,
            slide_image_2,
            slide_image_3,
            slide_image_4,
            slide_image_5,
            slide_image_6,
          ].map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`slide_image_${idx + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isLoggedIn ? (
        <>
          <UploadSummary />
        </>
      ) : null}

      {groupedBooks &&
        <div className="summaries max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-white text-center mt-12 mb-8">
            القي نظرة على ملخصاتنا
          </h3>
          {Object.entries(groupedBooks)
            .filter(([_, books]) => books.length > 0)
            .map(([genre, books], idx) => (
              <SummarySlider
                key={idx}
                title={`ملخصات ${genre}`}
                images={books.map((book) => book.image_url)}
                books={books}
                onImageClick={handleImageClick}
                className={`genre_slider_${idx}`}
                type="home"
              />
            ))}
        </div>
      }
    </div>
  );
}

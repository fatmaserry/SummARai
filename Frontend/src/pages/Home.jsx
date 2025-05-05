import React, { useContext, useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DropFileInput from "../components/DropFileInput.jsx";
import { AuthContext } from "../provider/auth/authProvider";
import { fetchAllBooks } from "../api/booksApi.js";
import SummarySlider from "../components/SummarySlider";
import slide_image_1 from "/assets/images/الساموراي.png";
import slide_image_2 from "/assets/images/الاثار الاسلامية.png";
import slide_image_3 from "/assets/images/الفرزدق.png";
import slide_image_4 from "/assets/images/الهجرة_إلى_الإنسانية.png";
import slide_image_5 from "/assets/images/مصر و الشام.png";

export default function HomePage() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { isLoggedIn } = useContext(AuthContext);
  const [groupedBooks, setGroupedBooks] = useState({});

  useEffect(() => {
    fetchAllBooks()
      .then(books => {
        const grouped = books.reduce((acc, book) => {
          book.genres.forEach(genre => {
            const genreName = genre.description;
            if (!acc[genreName]) acc[genreName] = [];
            acc[genreName].push(book);
          });
          return acc;
        }, {});
        setGroupedBooks(grouped);
        console.log("Grouped books:", grouped);
      })
      .catch(err => console.error("Failed to fetch books:", err));
  }, []);


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-white">
          مكتبة SummARai لتلخيص الكتب العربية
        </h3>
        <h3 className="text-2xl font-semibold text-white">
          اكثر من الف كتاب تم تلخيصهم بدقة بواسطة الذكاء الاصطناعي
        </h3>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6 mb-16 relative">
        <div
          ref={prevRef}
          className="swiper-button-prev absolute -left-12 top-1/2 transform -translate-y-1/2 z-10"
        >
          <ion-icon name="arrow-back-outline"></ion-icon>
        </div>
        <div
          ref={nextRef}
          className="swiper-button-next absolute -right-12 top-1/2 transform -translate-y-1/2 z-10"
        >
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
          {[
            slide_image_1,
            slide_image_2,
            slide_image_3,
            slide_image_4,
            slide_image_5,
          ].map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`slide_image_${idx + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {isLoggedIn ? (
        <>
          <h2 className="text-2xl font-semibold text-white text-center mb-4">
            يمكنك اضافة كتابك وتلخيصه
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
        </>
      ) : null}

      <div className="summaries">
        <h3 className="text-2xl font-semibold text-white text-center mt-12 mb-8">
          القي نظرة على ملخصاتنا
        </h3>
        {/* {[
          {
            title: "ملخصات في الأدب",
            className: "litrature_swiper",
            images: [
              slide_image_1,
              slide_image_1,
              slide_image_1,
              slide_image_1,
              slide_image_1,
            ],
          },
          {
            title: "ملخصات في التاريخ",
            className: "history_swiper",
            images: [
              slide_image_1,
              slide_image_1,
              slide_image_1,
              slide_image_1,
              slide_image_1,
            ],
          },
          {
            title: "ملخصات روايات",
            className: "story_swiper",
            images: [
              slide_image_1,
              slide_image_1,
              slide_image_1,
              slide_image_1,
              slide_image_1,
            ],
          },
        ].map((section, index) => (
          <SummarySlider
            key={index}
            title={section.title}
            images={section.images}
            className={section.className}
          />
        ))} */}
        {Object.entries(groupedBooks).map(([genre, books], idx) => (
          <SummarySlider
            key={idx}
            title={`ملخصات في ${ genre}`}
            images={books.map(book => book.image_url)}
            className={`genre_slider_${idx}`}
          />
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import DropFileInput from "../components/DropFileInput.jsx";
import SummarySlider from "../components/SummarySlider.jsx"; // Import the reusable slider
import { getCurrentReadings, getFinishedReadings } from "../api/summary/get-summaries.ts"; // Update path if needed
import { useNavigate } from "react-router-dom"; // To handle navigation when clicking a book

export default function Readings() {
  const [currentBooks, setCurrentBooks] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const navigate = useNavigate();

  // Handle clicking on a book cover
  const handleImageClick = (book) => {
    // Navigate to book details page with book data
    navigate("/summary", { state: { book  } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [current, finished] = await Promise.all([
          getCurrentReadings(),
          getFinishedReadings(),
        ]);
        setCurrentBooks(current);
        setFinishedBooks(finished);
      } catch (err) {
        console.error("Error fetching readings:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        اضِف قراءات جديدة
      </h2>

      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="box w-full max-w-md">
          <div className="border-2 border-dashed border-[#765CDE] rounded-xl p-6 text-center text-white">
            <DropFileInput
              onFileChange={(files) => console.log(files)}
              multiple={false}
            />
          </div>
          <button className="mt-4 bg-[#765CDE] text-white py-1.5 px-4 rounded-md text-sm mx-auto block">
            لخص
          </button>
        </div>
      </div>

      {currentBooks.length > 0 && (
        <SummarySlider
          title="تابع قراءة"
          images={currentBooks.map((book) => book.summaryDto.image_url)}
          books={currentBooks}
          onImageClick={handleImageClick}
          className="Continue_reading_swiper mt-20"
          type= "reading"
        />
      )}

      {finishedBooks.length > 0 && (
        <SummarySlider
          title="تم الانتهاء منه"
          images={finishedBooks.map((book) => book.summaryDto.image_url)}
          books={finishedBooks}
          onImageClick={handleImageClick}
          className="finished_reading_swiper mt-20"
          type= "reading"
        />
      )}
    </>
  );
}

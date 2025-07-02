import React, { useEffect, useState, useCallback, useMemo } from "react";
import SummarySlider from "../components/slider/index.jsx";
import { getCurrentReadings, getFinishedReadings } from "../api/summary/get-summaries.ts";
import { useNavigate } from "react-router-dom";
import WelcomeMessage from "../components/welcome-message/index.tsx";
import UploadSummary from "../components/upload-summary/index.tsx";

export default function Readings() {
  const [currentBooks, setCurrentBooks] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const navigate = useNavigate();
  const MemoizedWelcomeMessage = useMemo(() => <WelcomeMessage />, []);

  // Stable callback for image clicks
  const handleImageClick = useCallback((book) => {
    navigate("/summary", { state: { book } });
  }, [navigate]);

  // Memoized book data to prevent unnecessary re-renders
  const currentBooksData = useMemo(() => ({
    books: currentBooks,
    images: currentBooks.map((book) => book.summaryDto.image_url)
  }), [currentBooks]);

  const finishedBooksData = useMemo(() => ({
    books: finishedBooks,
    images: finishedBooks.map((book) => book.summaryDto.image_url)
  }), [finishedBooks]);

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
    <div className="readings-page">
      {MemoizedWelcomeMessage}
      <UploadSummary />
      {currentBooks.length > 0 && (
        <SummarySlider
          title="تابع قراءة"
          images={currentBooksData.images}
          books={currentBooksData.books}
          onImageClick={handleImageClick}
          className="Continue_reading_swiper mt-20"
          type="reading"
        />
      )}

      {finishedBooks.length > 0 && (
        <SummarySlider
          title="تم الانتهاء منه"
          images={finishedBooksData.images}
          books={finishedBooksData.books}
          onImageClick={handleImageClick}
          className="finished_reading_swiper mt-20"
          type="reading"
        />
      )}
    </div>
  );
}
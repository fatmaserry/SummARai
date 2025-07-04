import React, { useEffect, useState, useCallback, useMemo } from "react";
import SummarySlider from "../components/slider/index.jsx";
import { getCurrentReadings, getFinishedReadings } from "../api/summary/readings.ts";
import { getUserSummaries } from "../api/summary/get-summaries.ts";
import { useNavigate } from "react-router-dom";
import WelcomeMessage from "../components/welcome-message/index.tsx";
import UploadSummary from "../components/generate-summary/index.tsx";
import summarai_cover from "/assets/images/summarai_cover.png";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import colors from "../utils/colors.ts"

export default function Readings() {
  const [currentBooks, setCurrentBooks] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const navigate = useNavigate();
  const MemoizedWelcomeMessage = useMemo(() => <WelcomeMessage />, []);
  const [userSummaries, setUserSummaries] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Stable callback for image clicks
  const handleImageClick = useCallback((book) => {
    navigate("/summary", { state: { book } });
  }, [navigate]);

  // Memoized book data to prevent unnecessary re-renders
  const currentBooksData = useMemo(() => ({
    books: currentBooks,
    images: currentBooks.map((book) => book.summaryDto.image_url ? book.summaryDto.image_url : summarai_cover),
  }), [currentBooks]);

  const finishedBooksData = useMemo(() => ({
    books: finishedBooks,
    images: finishedBooks.map((book) => book.summaryDto.image_url ? book.summaryDto.image_url : summarai_cover)
  }), [finishedBooks]);

  const userSummariesData = useMemo(() => ({
    books: userSummaries,
    images: userSummaries.map(() => summarai_cover),
  }), [userSummaries]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [current, finished, mySummaries] = await Promise.all([
          getCurrentReadings(),
          getFinishedReadings(),
          getUserSummaries(),
        ]);
        setCurrentBooks(current);
        setFinishedBooks(finished);
        setUserSummaries(mySummaries.content || []); // set summaries content array
      } catch (err) {
        console.error("Error fetching readings:", err);
      }
    };

    fetchData();
  }, []);

  const creationDates = useMemo(() => {
    const datesSet = new Set(
      userSummaries
        .map((summary) => summary.creation_time)
        .filter(Boolean)
    );
    return Array.from(datesSet).sort((a, b) => new Date(b) - new Date(a));
  }, [userSummaries]);


  const filteredSummaries = useMemo(() => {
    if (!selectedDate) return userSummaries;
    return userSummaries.filter(summary => summary.creation_time === selectedDate);
  }, [userSummaries, selectedDate]);


  const filteredSummariesData = useMemo(() => ({
    books: filteredSummaries,
    images: filteredSummaries.map(() => summarai_cover),
  }), [filteredSummaries]);


  return (
    <div className="readings-page flex flex-col gap-10">
      {MemoizedWelcomeMessage}
      <UploadSummary />


      <div className="flex flex-col items-center justify-center w-full md:justify-between md:items-start">
        {userSummaries.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-center w-full m-4 justify-between">
              <h4 className="text-3xl font-semibold text-white text-right">
                ملخصاتي
              </h4>

              <div className="flex gap-4 items-center">
                <div className="relative group inline-block">
                  <span
                    className="px-4 py-1.5 rounded-xl flex justify-center items-center bg-primary-600 text-white hover:bg-primary-400 hover:text-black cursor-default"
                    aria-label="عدد الملخصات"
                  >
                    {filteredSummaries.length}
                  </span>

                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 rounded bg-black bg-opacity-80 text-white text-sm px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
                    عدد الملخصات
                  </div>
                </div>

                <SummaryDateFilter
                  creationDates={creationDates}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
            </div>
            {filteredSummaries.length > 0 && (
              <SummarySlider
                title=""
                images={filteredSummariesData.images}
                books={filteredSummariesData.books}
                onImageClick={(summary) => navigate("/summary", { state: { book: summary } })}
                className="user_summaries_swiper"
                type="summary"
              />
            )}

          </>
        )}

        {currentBooks.length > 0 && (
          <SummarySlider
            title="تابع قراءة"
            images={currentBooksData.images}
            books={currentBooksData.books}
            onImageClick={handleImageClick}
            className="Continue_reading_swiper"
            type="reading"
          />
        )}

        {finishedBooks.length > 0 && (
          <SummarySlider
            title="تم الانتهاء منه"
            images={finishedBooksData.images}
            books={finishedBooksData.books}
            onImageClick={handleImageClick}
            className="finished_reading_swiper"
            type="reading"
          />
        )}
      </div>

    </div>
  );
}

function SummaryDateFilter({ creationDates, selectedDate, setSelectedDate }) {
  return (
    <FormControl
      variant="filled"
      sx={{
        minWidth: 230,

        backgroundColor: colors.primary["600"],
        borderRadius: 3,
        "& .MuiFilledInput-root": {
          color: "white",
          backgroundColor: colors.primary["600"],
          height: "50px",
          borderRadius: 3,
          "&:before, &:after": {
            borderBottom: "none",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: "none",
          },
          display: "flex",
          alignItems: "center",
          paddingRight: 1, // padding to align text and arrow nicely
        },
        "& .MuiFilledInput-input": {
          // Vertically center the input text
          paddingTop: "20px",
          paddingBottom: "16px",
          fontSize: 18,
          lineHeight: 1,
        },
        "& .MuiSvgIcon-root": {
          color: "white",
          top: "calc(50% - 14px)", // adjust based on icon size
          position: "absolute",
          right: 12,
          pointerEvents: "none",
        },
        "& .MuiInputLabel-root": {
          color: "white",
          left: 12,
          top: 4,
        },
      }}
    >
      <InputLabel>تاريخ الإنشاء</InputLabel>
      <Select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        displayEmpty
        sx={{
          color: "white",
        }}
      >
        <MenuItem value="">
          <p>الكل</p>
        </MenuItem>
        {creationDates.map((date) => (
          <MenuItem key={date} value={date}>
            {new Date(date).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

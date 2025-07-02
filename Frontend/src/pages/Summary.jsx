import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  getSummaryById,
  setBookmark,
  getReadingDataBySummaryId,
  setFinishedSummary,
  getBook,
  addReading,
} from "../api/summary/get-summaries.ts";
import { updateUserStatistics } from "../api/user/statistics.ts";
import { Bookmark, SaveBookmark } from "../components/Icons";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
pdfjs.GlobalWorkerOptions.fontExtraProperties = true;
pdfjs.GlobalWorkerOptions.disableFontFace = false;

export default function Summary() {
  const location = useLocation();
  const { book } = location.state || {};
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [savedBookmark, setSavedBookmark] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const hasMarkedFinished = useRef(false);

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const data = await getReadingDataBySummaryId(book?.id);
        setApiData(data);
        if (data?.book_mark) {
          setPageNumber(data.book_mark);
          setSavedBookmark(data.book_mark);
        }
      } catch (error) {
        if (error?.response?.data?.error === "Reading not found") {
          // If reading data not found, create a new reading entry
          try {
            await addReading(book?.id);
            console.log("New reading entry created.");
            await fetchBookmark();
          } catch (addError) {
            console.error("Error creating new reading entry:", addError);
            setError("فشل إنشاء سجل قراءة جديد");
          }
          return;
        }
        console.error("Error fetching bookmark:", error);
        setError("فشل تحميل بيانات الكتاب");
      } finally {
        setIsLoading(false);
      }
    };

    if (book?.id) fetchBookmark();
  }, [book?.id]);

  const fetchAndValidatePdf = async () => {
    try {
      const response = await getSummaryById(book?.id);

      console.log("Raw response data:", response.data); // Inspect the raw data

      // Force binary handling (if using axios)
      const pdfData =
        response.data instanceof ArrayBuffer
          ? response.data
          : new TextEncoder().encode(response.data).buffer;

      // Save to a file for manual inspection (debugging)
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      console.log("Blob URL (open in new tab):", url); // Open this URL manually

      setPdfData(url);
    } catch (err) {
      console.error("PDF processing failed:", err);
      setError("PDF file is corrupted or invalid");
    }
  };

  useEffect(() => {
    return () => {
      if (pdfData) URL.revokeObjectURL(pdfData);
    };
  }, [pdfData]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const handleFinishSummary = async () => {
      if (numPages && pageNumber === numPages && !hasMarkedFinished.current) {
        try {
          const summaryId = book?.id;
          if (summaryId) {
            await setFinishedSummary(summaryId);
            console.log("Summary marked as finished.");
            hasMarkedFinished.current = true;
          }
        } catch (err) {
          console.error("Error finishing summary:", err);
        }
      }
    };

    handleFinishSummary();
  }, [pageNumber, numPages, book?.id]);

  const handleSaveBookmark = async () => {
    setSaveStatus("saving");
    try {
      const summaryId = book?.id;
      await setBookmark(summaryId, pageNumber);
      setSavedBookmark(pageNumber);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      setSaveStatus("error");
      setError(err.message);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleShowPdf = async () => {
    setShowPdf(true);
    await fetchAndValidatePdf();
    await updateUserStatistics();
  };

  if (isLoading) {
    return <div className="text-center py-8 flex justify-center items-center h-full">
      <img src="/assets/images/books.gif" alt="loading" width={200} />
    </div >;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="book-details-page text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-white">ملخص {book?.title}</h1>

      <div className="flex flex-col md:flex-row gap-8 p-6">
        <div className="w-full md:w-52">
          <img
            src={book?.image_url}
            alt={book?.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
          <h2 className="text-4xl font-semibold text-white">
            {book?.author?.name}
          </h2>

          <div className="">
            <h3 className="text-lg text-white font-semibold mb-2">
              مقدمة عن الكتاب:
            </h3>
            <p className="text-white text-md">{book?.about}</p>
          </div>
        </div>
      </div>

      {!showPdf ? (
        <div className="flex gap-4 mx-6">
          <button
            onClick={handleShowPdf}
            className="bg-[#765CDE] text-lg text-white font-bold py-1.5 px-3 rounded-lg hover:bg-[#6a50c9] transition-colors"
          >
            إظهار الملخص
          </button>
        </div>
      ) : (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg w-[52vw] mx-auto">
          <button
            onClick={handleSaveBookmark}
            disabled={saveStatus === "saving"}
          >
            {savedBookmark && savedBookmark === pageNumber ? (
              <SaveBookmark />
            ) : (
              <Bookmark />
            )}
          </button>

          {pdfData && (
            <div className="border border-gray-300 w-full">
              <Document
                file={pdfData}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="text-center py-8">جاري تحميل الملف...</div>
                }
                dir="rtl"
              >
                <Page
                  pageNumber={pageNumber}
                  width={Math.min(800, window.innerWidth - 40)}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </Document>
            </div>
          )}
          <div className="w-full flex justify-center mt-6">
            <div className="flex items-center justify-center gap-4 bg-[#241740
] text-white rounded-full px-6 py-2 bg-black w-fit">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="disabled:opacity-30 flex items-center justify-center"
              >
                <span className="text-lg">&lt;</span>
              </button>

              <span className="text-sm font-semibold">
                {numPages || "--"} / {pageNumber}
              </span>

              <button
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
                className="disabled:opacity-30 flex items-center justify-center"
              >
                <span className="text-lg">&gt;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

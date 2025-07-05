import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  getSummaryById,
  updateIsPublic
} from "../api/summary/get-summaries.ts";
import {
  addReading,
  setBookmark,
  getReadingDataBySummaryId,
  setFinishedSummary,
} from "../api/summary/readings.ts";
import { updateUserStatistics } from "../api/user/statistics.ts";
import { Bookmark, SaveBookmark } from "../components/Icons";
import useAuth from "../provider/auth/useAuth.jsx";
import toast from "react-hot-toast";

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
  const { user } = useAuth();

  // State for public/private toggle and confirmation popup
  const [isPublic, setIsPublic] = useState(book?.is_public ?? true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPublicValue, setPendingPublicValue] = useState(isPublic);

  // Check if current user is the owner of the book
  const isOwner = () => {
    return book?.owner_id && user?.id && (book.owner_id === user.id) ? true : false;
  };

  console.log(book)
  // Fetch bookmark and reading data for the summary
  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        if (!book?.id) return;
        const data = await getReadingDataBySummaryId(book.id);
        setApiData(data);
        if (data?.book_mark) {
          setPageNumber(data.book_mark);
          setSavedBookmark(data.book_mark);
        }
      } catch (error) {
        if (error?.response?.data?.error === "Reading not found") {
          // If reading data not found, create a new reading entry
          try {
            await addReading(book.id);
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

    fetchBookmark();
  }, [book?.id]);

  // Fetch and prepare PDF data for display
  const fetchAndValidatePdf = async () => {
    try {
      if (!book?.id) return;
      const response = await getSummaryById(book.id);

      console.log("Raw response data:", response.data);

      // Handle binary data correctly
      const pdfBinary =
        response.data instanceof ArrayBuffer
          ? response.data
          : new TextEncoder().encode(response.data).buffer;

      const blob = new Blob([pdfBinary], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      console.log("Blob URL (open in new tab):", url);

      setPdfData(url);
    } catch (err) {
      console.error("PDF processing failed:", err);
      setError("PDF file is corrupted أو غير صالح");
    }
  };

  // Cleanup blob URL on unmount or pdfData change
  useEffect(() => {
    return () => {
      if (pdfData) URL.revokeObjectURL(pdfData);
    };
  }, [pdfData]);

  // When PDF document loads, set number of pages
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Mark summary as finished when last page is reached
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

  // Save current page as bookmark
  const handleSaveBookmark = async () => {
    setSaveStatus("saving");
    try {
      const summaryId = book?.id;
      if (!summaryId) throw new Error("Invalid summary ID");
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

  // Show PDF and update user statistics
  const handleShowPdf = async () => {
    setShowPdf(true);
    await fetchAndValidatePdf();
    await updateUserStatistics();
  };

  // Toggle click handler: open confirmation popup
  const onToggleClick = () => {
    setPendingPublicValue(!isPublic);
    setShowConfirm(true);
  };

  // Confirm toggle change and update state (add your API call here)
  const onConfirmToggle = async () => {
    setShowConfirm(false);
    try {
      const newStatus = {
        summary_id: book.id,
        status: pendingPublicValue
      }
      const res = await updateIsPublic(newStatus);
      console.log(res)
      if (res.status === 200) {
        setIsPublic(pendingPublicValue);
        toast.success("تم تعديل ظهور الملخص بنجاح!");
      } else {
        toast.error("فشل في تعديل ظهور الملخص!");
      }
    } catch (err) {
      console.error("Failed to update visibility:", err);
      toast.error("فشل في تعديل رؤية الملخصات!");
    }
  };

  // Cancel toggle change
  const onCancelToggle = () => {
    setShowConfirm(false);
    setPendingPublicValue(isPublic);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 flex justify-center items-center h-full">
        <img src="/assets/images/books.gif" alt="loading" width={200} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  console.log(book)
  return (
    <div className="book-details-page text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-white">ملخص {book?.title ?? "..."}</h1>

      <div className="flex flex-col md:flex-row gap-8 p-6">
        {/* Image and info container */}
        <div className={`flex flex-col rounded ${book.summaryType == "USER" ? "bg-white md:w-52" : ""}`}>
          <img
            src={book?.image_url ?? "/assets/images/summarai_cover.png"}
            alt={book?.title ?? "Book cover"}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="flex flex-col text-white">
          {/* Creation time */}
          {book?.creation_time && <div>
            <span className="font-semibold ml-2">تاريخ الإنشاء:</span>
            <span>{book?.creation_time}</span>
          </div>
          }

          {/* Number of pages */}
          <div>
            <span className="font-semibold ml-2">عدد الصفحات:</span>
            <span>{book?.number_of_pages ?? "--"}</span>
          </div>

          {/* Genres */}
          <div className="flex gap-3 my-3">
            {book.genres && book.genres.map((genre, idx) => {
              return (
                <span
                  key={idx}
                  className={`px-4 py-2 text-base rounded-full font-semibold border transition-all duration-200 bg-primary-600 text-white border-[#765CDE]`}
                >
                  {genre.description}
                </span>
              );

            })}
          </div>


          {/* Public/private toggle */}
          {isOwner() && <ToggleSwitch isPublic={isPublic} onToggle={onToggleClick} />}

          {/* Book details */}
          <div className="w-full md:w-2/3 lg:w-3/4 space-y-6">
            {book?.author && (
              <h2 className="text-4xl font-semibold text-white">{book.author.name}</h2>
            )}

            {book?.about && (
              <div>
                <h3 className="text-lg text-white font-semibold mb-2">مقدمة عن الكتاب:</h3>
                <p className="text-white text-md">{book.about}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Show PDF button or PDF viewer */}
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
          <button onClick={handleSaveBookmark} disabled={saveStatus === "saving"}>
            {savedBookmark === pageNumber ? <SaveBookmark /> : <Bookmark />}
          </button>

          {pdfData && (
            <div className="border border-gray-300 w-full">
              <Document
                file={pdfData}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="text-center py-8">جاري تحميل الملف...</div>}
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

          {/* Pagination controls */}
          <div className="w-full flex justify-center mt-6">
            <div className="flex items-center justify-center gap-4 bg-[#241740] text-white rounded-full px-6 py-2 bg-black w-fit">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                className="disabled:opacity-30 flex items-center justify-center"
              >
                <span className="text-lg">&lt;</span>
              </button>

              <span className="text-sm font-semibold">
                {pageNumber} / {numPages || "--"}
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

      {/* Confirmation Popup */}
      {showConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-right space-y-4">
            <h2 className="text-xl font-semibold">
              هل أنت متأكد أنك تريد تغيير الحالة إلى {pendingPublicValue ? "عام" : "خاص"}؟
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={onCancelToggle}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                onClick={onConfirmToggle}
                className="px-4 py-2 rounded bg-[#765CDE] text-white hover:bg-[#5a47b0]"
              >
                تأكيد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ isPublic, onToggle }) {
  return (
    <div className="flex items-center gap-2" dir="rtl">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPublic}
        aria-label="تبديل الحالة بين عام وخاص"
        className={`
          relative w-16 h-8 rounded-full transition-colors duration-200
          focus:outline-none
          ${isPublic ? "bg-green-500" : "bg-gray-400"}
        `}
        style={{ minWidth: 64, minHeight: 32, padding: 0 }}
      >
        <span
          className={`
            absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200
            ${isPublic ? "translate-x-8" : ""}
          `}
          style={{ minWidth: 24, minHeight: 24 }}
        />
      </button>
      <span className="text-white font-bold text-xl">{isPublic ? "عام" : "خاص"}</span>
    </div>
  );
}


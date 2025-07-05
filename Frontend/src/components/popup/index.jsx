import { useSSE } from '../../provider/context/SSEContext';
import { useNavigate } from "react-router-dom";


const GlobalCompletionPopup = () => {
    const { summaryResult, showCompletion, closeCompletion } = useSSE();
    const navigate = useNavigate();

    if (!showCompletion || !summaryResult) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 pointer-events-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
                    التلخيص جاهز
                </h2>
                <div className="space-y-3">
                    <p className="text-gray-700">
                        <span className="font-semibold">العنوان:</span>{" "}
                        {summaryResult.title}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">عدد الصفحات:</span>{" "}
                        {summaryResult.number_of_pages}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">الظهور:</span>{" "}
                        {summaryResult.is_public ? "عام" : "خاص"}
                    </p>
                    <a
                        className="block mt-4 bg-primary-600 cursor-pointer text-white text-base text-center py-2 rounded-xl hover:bg-primary-400"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            closeCompletion();
                            navigate("/summary", { state: { book: summaryResult } });
                        }}
                    >
                        افتح الملخص
                    </a>
                </div>
                <button
                    onClick={closeCompletion}
                    className="mt-4 w-full bg-gray-300 text-base text-gray-800 py-2 rounded-xl"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );
};

export default GlobalCompletionPopup;
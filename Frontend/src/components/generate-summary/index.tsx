import React, { useContext, useState } from "react";
import DropFileInput from "../drop-file-input";
import { useSSE } from "../../provider/context/SSEContext";

function UploadSummary() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const {
    startProcessing,
    isProcessing,
    progress,
    summaryResult,
    resetProcessing,
  } = useSSE();

  return (
    <>
      <h2 className="text-3xl font-semibold text-white text-center">
        يمكنك اضافة كتابك وتلخيصه
      </h2>
      <div className="flex justify-center items-center p-2">
        <div className="box w-full max-w-md">
          <div className="border-2 border-dashed border-[#765CDE] rounded-xl p-6 text-center text-white">
            <DropFileInput
              onFileChange={(files) => setSelectedFile(files[0])}
            />
          </div>

          <button
            disabled={!selectedFile}
            type="button"
            onClick={() => setShowModal(true)}
            className={`mt-4 ${
              !selectedFile ? "bg-gray-300" : "bg-[#765CDE] hover:bg-purple-500"
            } text-white py-1.5 px-4 rounded-md text-sm mx-auto block`}
          >
            لخص
          </button>
        </div>
      </div>

      {/* Upload Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              تفاصيل التلخيص
            </h2>

            <label className="block mb-2 text-right text-md text-gray-700">
              العنوان
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-base"
              placeholder="عنوان التلخيص"
            />

            <label className="flex items-center text-md justify-between text-gray-700 mb-4">
              <span>هل تريد جعل التلخيص عامًا؟</span>
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="peer w-6 h-6 appearance-none border-2 border-gray-300 rounded-md checked:bg-primary-600 checked:border-primary-600 transition-all duration-200 focus:outline-none"
                />
                <svg
                  className="absolute left-1 top-1 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </label>
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-base text-gray-800 px-4 py-2 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                title="generate-summary"
                onClick={() => {
                  startProcessing(selectedFile!, title, isPublic);
                  setShowModal(false);
                }}
                className="bg-primary-700 text-base hover:bg-primary-400 cursor-pointer text-white px-4 py-2 rounded-xl"
              >
                متابعة
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadSummary;

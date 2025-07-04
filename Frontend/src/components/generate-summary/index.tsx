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

      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              جاري معالجة الملف
            </h2>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{progress.message}</span>
                <span className="text-gray-700">{progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#765CDE] h-2.5 rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Upload Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              تفاصيل التلخيص
            </h2>

            <label className="block mb-2 text-right text-gray-700">
              العنوان
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="عنوان التلخيص"
            />

            <label className="flex items-center justify-between text-gray-700 mb-4">
              <span>هل تريد جعل التلخيص عامًا؟</span>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  startProcessing(selectedFile!, title, isPublic);
                  setShowModal(false);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded"
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

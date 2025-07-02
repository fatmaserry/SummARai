import React, { useState } from "react";
import DropFileInput from "../drop-file-input";
import toast from "react-hot-toast";

function UploadSummary() {
  const [selectedFile, setSelectedFile] = useState(null);
  const onFileChange = (files) => {
    setSelectedFile(files[0]); // Store the first file
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      toast.error("الرجاء اختيار ملف أولاً");
      return;
    }

    try {
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء رفع الملف");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-semibold text-white text-center">
        يمكنك اضافة كتابك وتلخيصه
      </h2>
      <div className="flex justify-center items-center p-2">
        <div className="box w-full max-w-md">
          <div className="border-2 border-dashed border-[#765CDE] rounded-xl p-6 text-center text-white">
            <DropFileInput onFileChange={(files) => onFileChange(files)} />
          </div>
          <button
            onClick={() => {
              handleFileUpload(selectedFile);
              setSelectedFile(null);
            }}
            className="mt-4 bg-[#765CDE] hover:bg-purple-500 text-white py-1.5 px-4 rounded-md text-sm mx-auto block"
          >
            لخص
          </button>
        </div>
      </div>
    </>
  );
}

export default UploadSummary;

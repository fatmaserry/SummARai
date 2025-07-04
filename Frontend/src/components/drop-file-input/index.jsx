import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import "./drop-file-input.css";

import { ImageConfig } from "./ImageConfig";
import { Upload } from "../Icons";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const MIN_FILE_SIZE = 200 * 1024;  // 200 KB
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

  // Drag and drop handlers
  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = (e) => {
    e.preventDefault();
    wrapperRef.current.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Click handler for the drop zone
  const onAreaClick = () => {
    fileInputRef.current.click();
  };

  // Check for Arabic text
  const containsArabic = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    try {
      const pdfjsLib = await import("pdfjs-dist/build/pdf");
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.entry");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ");
      }

      return text;
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      return "";
    }
  };

  // Main file handling function
  const handleFiles = async (files) => {
    const newFile = files[0];
    if (!newFile) return;

    // File size validation
    // if (newFile.size < MIN_FILE_SIZE) {
    //   toast.error(`الملف صغير جداً. الحد الأدنى للحجم هو ${MIN_FILE_SIZE / 1024}KB`);
    //   return;
    // }

    if (newFile.size > MAX_FILE_SIZE) {
      toast.error(`الملف كبير جداً. الحد الأقصى للحجم هو ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // File type validation
    if (newFile.type !== "application/pdf") {
      toast.error("الرجاء رفع ملف PDF فقط");
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(newFile);
      if (containsArabic(text)) {
        const updatedList = [newFile];
        setFileList(updatedList);
        props.onFileChange && props.onFileChange(updatedList);
      } else {
        toast.error("الرجاء رفع ملف PDF يحتوي على نص عربي فقط");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحليل الملف");
      console.error("File processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // File input change handler
  const onFileDrop = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Remove file handler
  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange && props.onFileChange(updatedList);
  };

  return (
    <>
      {fileList.length === 0 ? (
        <div
          ref={wrapperRef}
          className="drop-file-input flex flex-col items-center justify-center"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onAreaClick}
          role="button"
          aria-label="Upload PDF file"
          tabIndex="0"
        >
          <div className="drop-file-input__label flex flex-col items-center">
            <Upload className="w-16 h-16 mb-4" />
            <p className="text-base font-semibold text-white text-center leading-relaxed">
              اسحب و ضع <span className="text-[#765CDE]">الكتاب</span> هنا{" "}
              <br />
              او <span className="text-[#765CDE] underline">تصفح ملفاتك</span>
            </p>
            {isProcessing && (
              <p className="text-white mt-2">جارٍ تحليل الملف...</p>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={onFileDrop}
            className="hidden"
          />
        </div>
      ) : (
        <div className="drop-file-preview mt-0">
          {fileList.map((item, index) => (
            <div
              key={index}
              className="drop-file-preview__item flex flex-col items-center gap-2"
            >
              <img
                src={
                  ImageConfig[item.type.split("/")[1]] || ImageConfig["default"]
                }
                alt="file icon"
                className="w-12 h-12"
              />
              <div className="text-center">
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-gray-400 text-sm" dir="ltr">
                  {(item.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <span
                className="drop-file-preview__item__del cursor-pointer text-white-400 font-bold"
                onClick={() => fileRemove(item)}
                aria-label="Remove file"
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

DropFileInput.propTypes = {
  onFileChange: PropTypes.func,
};

export default DropFileInput;
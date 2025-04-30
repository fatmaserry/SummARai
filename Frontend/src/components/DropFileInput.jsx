import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import "./drop-file-input.css";

import { ImageConfig } from "../components/ImageConfig.js";
import { Upload } from "../components/Icons";

const DropFileInput = (props) => {
  const wrapperRef = useRef(null);
  const [fileList, setFileList] = useState([]);

  const onDragEnter = () => wrapperRef.current.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
  const onDrop = () => wrapperRef.current.classList.remove("dragover");

  const onFileDrop = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      const updatedList = [newFile];
      setFileList(updatedList);
      props.onFileChange(updatedList);
    }
  };

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
    props.onFileChange(updatedList);
  };

  return (
    <>
      {fileList.length === 0 && (
        <div
          ref={wrapperRef}
          className="drop-file-input flex flex-col items-center justify-center"
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="drop-file-input__label flex flex-col items-center">
            <Upload className="w-16 h-16 mb-4" />
            <p className="text-base font-semibold text-white text-center leading-relaxed">
              اسحب و ضع <span className="text-[#765CDE]">الكتاب</span> هنا{" "}
              <br />
              او <span className="text-[#765CDE] underline">تصفح ملفاتك</span>
            </p>
          </div>
          <input type="file" onChange={onFileDrop} />
        </div>
      )}

      {/* Show the uploaded file preview */}
      {fileList.length > 0 && (
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
              <p className="text-white font-medium">{item.name}</p>
              <span
                className="drop-file-preview__item__del cursor-pointer text-white-400 font-bold"
                onClick={() => fileRemove(item)}
              >
                x
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

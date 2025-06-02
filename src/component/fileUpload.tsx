// changes by Mahi

import React, { useState, useRef } from "react";
import "./fileUpload.css";
import logoLight from "./../assets/logo-light.svg";
import logoDark from "./../assets/logo-dark.svg";
import pdfLogo from "./../assets/pdf-logo.svg";
import pngLogo from "./../assets/png-logo.svg"; // Add a JPG logo
import jpgLogo from "./../assets/jpg-logo.svg"; // Add a PNG logo
import deleteLogo from "./../assets/delete-logo.svg";
import cancelLogoLight from "./../assets/cancel-logo.svg";
import cancelLogoDark from "./../assets/cancel-logo-dark.svg";
import successLogo from "./../assets/success-logo.svg";
import loadingLogo from "./../assets/loading-icon .svg";
import errorLogo from "./../assets/error-logo.svg";
import dropdownIcon from "./../assets/dropdown-light.svg";

import dropdownIconLight from "./../assets/dropdown-light.svg"; // Add a dropdown icon for light mode
import dropdownIconDark from "./../assets/dropdown-dark.svg"; // Add a dropdown icon for dark mode
import dropdownUpIconLight from "./../assets/dropDownUp-light.svg"; // Add a dropdown up icon for light mode
import dropdownUpIconDark from "./../assets/dropDownUp-dark.svg"; // Add a dropdown up icon for dark mode



interface FileUploadProps {
  mode: "light" | "dark";
}

interface FileWithProgress {
  file: File;
  progress: number;
  controller: AbortController;
}

const FileUpload: React.FC<FileUploadProps> = ({ mode }) => {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isFileListVisible, setIsFileListVisible] = useState(true); // State to manage file list visibility
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cancelLogo = mode === "light" ? cancelLogoLight : cancelLogoDark;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []).map((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "video/mp4",
      ];
      if (!allowedTypes.includes(file.type)) {
        // If file type is not allowed
        return {
          file,
          progress: -1,
          controller: new AbortController(),
        };
      }
      return {
        file,
        progress: 0,
        controller: new AbortController(),
      };
    });
    setFiles([...files, ...newFiles]);
    newFiles.forEach((fileWithProgress) => {
      if (fileWithProgress.progress !== -1) {
        uploadFile(fileWithProgress);
      }
    });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const newFiles = Array.from(event.dataTransfer.files).map((file) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "video/mp4",
      ];
      if (!allowedTypes.includes(file.type)) {
        // If file type is not allowed
        return {
          file,
          progress: -1,
          controller: new AbortController(),
        };
      }
      return {
        file,
        progress: 0,
        controller: new AbortController(),
      };
    });
    setFiles([...files, ...newFiles]);
    newFiles.forEach((fileWithProgress) => {
      if (fileWithProgress.progress !== -1) {
        uploadFile(fileWithProgress);
      }
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const uploadFile = (fileWithProgress: FileWithProgress) => {
    const { file, controller } = fileWithProgress;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload"); // Replace with your upload URL

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file.name === file.name ? { ...f, progress } : f
          )
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file.name === file.name ? { ...f, progress: 100 } : f
          )
        );
      }
    };

    xhr.onerror = () => {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.file.name === file.name ? { ...f, progress: -1 } : f
        )
      );
    };

    xhr.onabort = () => {
      setFiles((prevFiles) =>
        prevFiles.filter((f) => f.file.name !== file.name)
      );
    };

    xhr.send(file);
  };

  const handleDelete = (fileName: string) => {
    setFiles(files.filter((file) => file.file.name !== fileName));
  };

  const handleCancel = (fileName: string) => {
    setFiles(files.filter((file) => file.file.name !== fileName));
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileLogo = (fileType: string) => {
    switch (fileType) {
      case "application/pdf":
        return pdfLogo;
      case "image/jpeg":
        return jpgLogo;
      case "image/png":
        return pngLogo;
      default:
        return logoLight;
    }
  };

  const toggleFileListVisibility = () => {
    if (files.length > 0) {
      setIsFileListVisible(!isFileListVisible);
    }
  };

  return (
    <div className={`file-upload ${mode}`}>
      <div className="upload-header">
        <img
          src={mode === "light" ? logoLight : logoDark}
          className="header-Logo"
          alt="header-logo"
        />
        <div className="header-text">
          <p>
            Upload files <br />
            <span className="p1">
              Select and upload the files of your choice
            </span>
          </p>
        </div>
        <div className="dropdown-icon">
          <img
            src={
              files.length === 0
                ? mode === "light"
                  ? dropdownIconLight
                  : dropdownIconDark
                : isFileListVisible
                ? mode === "light"
                  ? dropdownUpIconLight
                  : dropdownUpIconDark
                : mode === "light"
                ? dropdownIconLight
                : dropdownIconDark
            }
            alt="dropdown-icon"
            onClick={toggleFileListVisibility}
          />
        </div>
      </div>

      <div
        className="upload-body"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="upload-body-border-input">
          <div className="upload-body-logo">
            <img
              src={mode === "light" ? logoLight : logoDark}
              alt="logo-image"
              className="Logo"
            />
          </div>
          <div className="upload-body-text">
            <p className="drag-drop-text">
              Choose a file or drag it here <br />
              <span className="file-format-text">
                JPEG,PNG,PDF, and MP4 formats up to 50MB
              </span>
            </p>
          </div>

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="file-input"
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button onClick={handleButtonClick} className="browse-button">
            <span className="browse-text">Browse File</span>
          </button>
        </div>
        {isFileListVisible && (
          <div className="file-list">
            {files.map(({ file, progress }) => (
              <div key={file.name} className="file-item">
                <div className="file-item-content">
                  <div className="file-item-info">
                    <div className="file-item-icon">
                      <span className="file-item-icon-label">
                        <img src={getFileLogo(file.type)} alt="file-logo" />
                      </span>
                    </div>
                    <div className="file-item-details">
                      <p className="file-item-name">
                        {file.name}
                        <br />
                        <span className="file-item-size">
                          {`${((file.size * (progress / 100)) / 1024).toFixed(
                            2
                          )} KB of ${(file.size / 1024).toFixed(2)} KB`}
                          {progress < 100 && progress >= 0 && (
                            <span className="progress-text">
                              <img
                                className="loading-logo"
                                src={loadingLogo}
                                alt="loading-logo"
                              />{" "}
                              Uploading
                            </span>
                          )}
                          {progress === 100 && (
                            <span className="file-status-Uploaded">
                              <img
                                className="success-logo"
                                src={successLogo}
                                alt="success-logo"
                              />
                              Uploaded
                            </span>
                          )}
                          {progress === -1 && (
                            <span className="file-status-Error">
                              <img
                                className="error-logo"
                                src={errorLogo}
                                alt="error-logo"
                              />{" "}
                              Error
                            </span>
                          )}
                        </span>
                        <span>
                          <p className="file-item-status-text"></p>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="file-item-status">
                    <button
                      onClick={() =>
                        progress < 100
                          ? handleCancel(file.name)
                          : handleDelete(file.name)
                      }
                      className="delete-button"
                    >
                      <img
                        src={progress < 100 ? cancelLogo : deleteLogo}
                        alt="action-logo"
                      />
                    </button>
                  </div>
                </div>
                <div className="file-item-progress">
                  <div className="file-item-progress-bar-bg">
                    <div
                      className={`file-item-progress-bar ${
                        progress === -1 ? "error" : ""
                      }`}
                      style={{ width: `${progress === -1 ? 50 : progress}%` }}
                    >
                      {" "}
                    </div>
                  </div>
                  {![
                    "image/jpeg",
                    "image/png",
                    "application/pdf",
                    "video/mp4",
                  ].includes(file.type) && (
                    <span className="file-error-text">
                      This file is not an accepted. You can upload .jpg and .pdf
                      file formats
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

// ----------------------------------------------

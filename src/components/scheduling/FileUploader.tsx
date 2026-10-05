"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, X, AlertCircle, FileDown } from "lucide-react";

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onError: (errorMsg: string | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  onFileSelect,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    onError(null);
    if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      onError("Please upload a valid .xlsx or .xls file.");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      onError("File size exceeds 2 MB limit.");
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
          Upload Employee Excel Data
        </label>
        <span className="text-xs text-zinc-400">Max 2 MB (.xlsx, .xls)</span>
      </div>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-150 ${
            isDragging
              ? "border-zinc-900 bg-zinc-100/70"
              : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-400 hover:bg-zinc-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleChange}
            className="sr-only"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-600 shadow-2xs group-hover:scale-105 transition-transform mb-3">
            <UploadCloud className="h-6 w-6 text-zinc-700" />
          </div>
          <p className="text-sm font-semibold text-zinc-900">
            Drop your employee Excel file here, or{" "}
            <span className="text-zinc-600 underline underline-offset-2">browse files</span>
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Includes employee names, roles, skills, and availability
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center space-x-3 truncate">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-zinc-400 font-mono">
                {(file.size / 1024).toFixed(1)} KB • Ready for processing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

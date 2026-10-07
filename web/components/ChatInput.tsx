"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Paperclip, 
  HardDrive, 
  MoreHorizontal, 
  Image, 
  Music, 
  Layout, 
  Compass, 
  Plus, 
  X 
} from "lucide-react";

export default function ChatInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selected files from system file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
    setIsOpen(false);
  };

  const handleMenuAction = (actionType: string) => {
    if (actionType === "file") {
      fileInputRef.current?.click();
    } else {
      console.log(`Selected option: ${actionType}`);
      setIsOpen(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto p-4">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        multiple 
      />

      {/* Pop-up Attachment Menu */}
      {isOpen && (
        <div 
          ref={menuRef} 
          className="absolute bottom-20 left-6 w-60 bg-white border border-gray-200 rounded-2xl shadow-lg py-2 z-50 text-gray-700"
        >
          <button 
            type="button"
            onClick={() => handleMenuAction("file")} 
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <Paperclip size={18} className="text-gray-500" /> Upload files
          </button>
          
          <button 
            type="button"
            onClick={() => handleMenuAction("drive")} 
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <HardDrive size={18} className="text-gray-500" /> Add from Drive
          </button>

          <button 
            type="button"
            onClick={() => handleMenuAction("more")} 
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <span className="flex items-center gap-3">
              <MoreHorizontal size={18} className="text-gray-500" /> More uploads
            </span>
            <span className="text-gray-400 text-xs">&gt;</span>
          </button>

          <hr className="my-1 border-gray-100" />

          <button 
            type="button"
            onClick={() => handleMenuAction("image")} 
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <Image size={18} className="text-gray-500" /> Create image
          </button>

          <button 
            type="button"
            onClick={() => handleMenuAction("music")} 
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <Music size={18} className="text-gray-500" /> Create music
          </button>

          <button 
            type="button"
            onClick={() => handleMenuAction("canvas")} 
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <Layout size={18} className="text-gray-500" /> Canvas
          </button>

          <button 
            type="button"
            onClick={() => handleMenuAction("deep_research")} 
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm font-medium transition"
          >
            <Compass size={18} className="text-gray-500" /> Deep Research
          </button>
        </div>
      )}

      {/* Main Input Field Container */}
      <div className="bg-white rounded-3xl border border-gray-300 shadow-sm p-3 focus-within:border-gray-400 transition">
        
        {/* Attached Files Preview Badges */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 px-2">
            {selectedFiles.map((file, idx) => (
              <span key={idx} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                <Paperclip size={12} />
                <span className="max-w-[120px] truncate">{file.name}</span>
                <button type="button" onClick={() => removeFile(idx)} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Plus Icon Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition focus:outline-none"
            aria-label="Add attachment"
          >
            {isOpen ? <X size={20} /> : <Plus size={20} />}
          </button>

          {/* Prompt Text Input */}
          <input 
            type="text" 
            placeholder="Message Assistant..." 
            className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-base"
          />
        </div>
      </div>
    </div>
  );
}
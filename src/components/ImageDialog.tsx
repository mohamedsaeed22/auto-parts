"use client";
import React, { useEffect } from "react";
import { X, Download, Maximize2, Minimize2 } from "lucide-react";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  alt?: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  alt = "Image",
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;

    // Handle data URLs properly
    if (imageUrl.startsWith("data:")) {
      // For data URLs, use a clean filename based on the title
      const cleanTitle = title
        .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
        .replace(/\s+/g, "_");
      link.download = `${cleanTitle}.png`;
    } else {
      // For regular URLs, try to extract extension
      link.download = `${title}.${imageUrl.split(".").pop() || "jpg"}`;
    }

    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent touch events from bubbling up on mobile
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm transition-all duration-300 ease-out"
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        animation: isOpen ? "fadeIn 0.3s ease-out" : "fadeOut 0.3s ease-out",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        minHeight: "100dvh", // Dynamic viewport height for mobile
      }}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        @keyframes slideIn {
          from {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes slideInMobile {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .mobile-dialog {
            animation: slideInMobile 0.3s ease-out !important;
            transform: translateY(0) !important;
          }
        }
      `}</style>

      <div
        className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ease-out transform mobile-dialog ${
          isFullscreen
            ? "fixed inset-2 sm:inset-4"
            : "max-w-6xl w-full mx-2 sm:mx-4"
        }`}
        style={{
          position: isFullscreen ? "fixed" : "relative",
          animation: "slideIn 0.3s ease-out",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          maxHeight: isFullscreen
            ? "calc(100dvh - 1rem)"
            : "calc(100dvh - 2rem)", // Dynamic viewport height
          height: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header with Gradient */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-1.5 sm:p-2 rounded-xl bg-white/70 hover:bg-blue-500 hover:text-white text-gray-600 transition-all duration-200 hover:scale-105 shadow-sm touch-manipulation"
              title="Download Image"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Fullscreen Toggle - Hide on mobile */}
            <button
              onClick={toggleFullscreen}
              className="hidden sm:block p-2 rounded-xl bg-white/70 hover:bg-indigo-500 hover:text-white text-gray-600 transition-all duration-200 hover:scale-105 shadow-sm"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/70 hover:bg-red-500 hover:text-white text-gray-600 transition-all duration-200 hover:scale-105 shadow-sm touch-manipulation"
              title="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Image Content */}
        <div
          className={`relative ${
            isFullscreen ? "h-[calc(100%-80px)]" : "h-[70vh] sm:h-[80vh]"
          } p-3 sm:p-6 bg-gray-50`}
        >
          <div className="w-full h-full bg-white rounded-xl shadow-inner overflow-hidden border border-gray-200 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-xl"
              style={{
                pointerEvents: "auto",
                minHeight: "200px", // Ensure minimum height on mobile
              }}
              loading="lazy"
            />
          </div>

          {/* Loading State Placeholder */}
          <div className="absolute inset-6 bg-white rounded-xl border border-gray-200 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">Loading Image...</p>
            </div>
          </div>
        </div>

        {/* Enhanced Footer with Info */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          {/* <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Image Viewer</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Press ESC to close</span>
              <span>•</span>
              <span>Click outside to close</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ImageDialog;

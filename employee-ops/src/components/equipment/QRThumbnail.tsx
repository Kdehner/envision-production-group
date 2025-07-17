// employee-ops/src/components/equipment/QRThumbnail.tsx

"use client";

import { useState, useEffect } from "react";
import { QrCode, Eye } from "lucide-react";
import { generateThumbnailQR } from "@/lib/qr";

interface QRThumbnailProps {
  documentId: string;
  sku?: string;
  size?: "small" | "medium";
  onClick?: () => void;
  className?: string;
}

export default function QRThumbnail({
  documentId,
  sku,
  size = "small",
  onClick,
  className = "",
}: QRThumbnailProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    generateQR();
  }, [documentId]);

  const generateQR = async () => {
    if (!documentId) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const qr = await generateThumbnailQR(documentId);
      setQrCode(qr);
    } catch (err) {
      console.error("QR thumbnail generation error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
  };

  const containerClasses = `
    ${sizeClasses[size]} 
    ${onClick ? "cursor-pointer hover:opacity-80" : ""} 
    ${className}
  `.trim();

  if (loading) {
    return (
      <div
        className={`${containerClasses} bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center`}
      >
        <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !qrCode) {
    return (
      <div
        className={`${containerClasses} bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center`}
        title="QR code unavailable"
      >
        <QrCode className="w-3 h-3 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={`${containerClasses} bg-white rounded border border-gray-200 dark:border-gray-600 p-1 group relative`}
      onClick={onClick}
      title={`QR code for ${sku || documentId}`}
    >
      <img
        src={qrCode}
        alt={`QR code for ${sku || documentId}`}
        className="w-full h-full object-contain"
      />

      {/* Hover overlay for clickable thumbnails */}
      {onClick && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Eye className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
}

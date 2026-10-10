import React, { useState } from 'react';
import { Camera, Upload, X, CheckCircle, Image as ImageIcon, AlertTriangle, Sparkles, Zap } from 'lucide-react';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';
import { compressMultipleImages } from '../../utils/imageCompressor';

export const ImageUploader = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [compressionStats, setCompressionStats] = useState(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setErrorMsg("");
    if (images.length + files.length > maxImages) {
      setErrorMsg(`You can upload a maximum of ${maxImages} crop photos.`);
      e.target.value = '';
      return;
    }

    // Validate formats
    const invalidFormat = files.find(f => !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type));
    if (invalidFormat) {
      setErrorMsg("Only JPG, JPEG, PNG, and WebP images are allowed.");
      e.target.value = '';
      return;
    }

    setCompressing(true);
    setProgress(10);
    setCompressionStats(null);

    try {
      // Compress and convert to Base64 client-side
      const compressedResults = await compressMultipleImages(
        files,
        { maxWidth: 1000, maxHeight: 1000, quality: 0.72 },
        (pct) => setProgress(Math.min(95, Math.max(10, pct)))
      );

      const newBase64Images = compressedResults.map(r => r.dataUrl);
      const totalOriginalKb = compressedResults.reduce((acc, curr) => acc + curr.originalSizeKb, 0);
      const totalCompressedKb = compressedResults.reduce((acc, curr) => acc + curr.compressedSizeKb, 0);
      const savingsPct = totalOriginalKb > 0 
        ? Math.round(((totalOriginalKb - totalCompressedKb) / totalOriginalKb) * 100) 
        : 0;

      setProgress(100);
      setCompressionStats({
        originalKb: totalOriginalKb,
        compressedKb: totalCompressedKb,
        savingsPct,
        count: compressedResults.length
      });

      onImagesChange([...images, ...newBase64Images]);
    } catch (err) {
      console.error("Image compression error:", err);
      setErrorMsg("Error processing images. Please select valid photo files.");
    } finally {
      setTimeout(() => {
        setCompressing(false);
      }, 300);
      // Reset input value so user can upload again if needed
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Upload Drop Zone / Button */}
      <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 rounded-2xl p-6 text-center transition-all">
        <input 
          type="file" 
          id="crop-image-input" 
          multiple 
          accept="image/jpeg,image/jpg,image/png,image/webp" 
          onChange={handleFileSelect}
          className="hidden" 
          disabled={images.length >= maxImages || compressing}
        />
        <label 
          htmlFor="crop-image-input"
          className="cursor-pointer flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform">
            <Camera className="w-7 h-7" />
          </div>
          <div>
            <span className="text-base font-bold text-emerald-900 block">
              Tap to Take Photo or Upload Crop Images
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Supports JPG, PNG & WebP (Auto-compressed to ultra-lightweight Base64 — no cloud storage needed)
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              <Upload className="w-3.5 h-3.5" /> Upload up to {maxImages} photos ({images.length}/{maxImages})
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
              <Zap className="w-3 h-3 text-blue-600" /> Direct Database Sync
            </span>
          </div>
        </label>
      </div>

      {/* Compression & Upload Progress Bar */}
      {compressing && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 animate-bounce text-emerald-600" /> 
              Compressing & converting to Base64 in-browser...
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full transition-all duration-200 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Compression Success Banner */}
      {compressionStats && !compressing && (
        <div className="flex items-center justify-between gap-2 p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl text-xs text-emerald-900">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Optimized {compressionStats.count} photo(s):</strong> {compressionStats.originalKb} KB → {compressionStats.compressedKb} KB
              {compressionStats.savingsPct > 0 && <span className="ml-1 text-emerald-700 font-bold">({compressionStats.savingsPct}% smaller)</span>}
            </span>
          </div>
          <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            Zero Storage Cost
          </span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Previews Grid */}
      {images.length > 0 && (
        <div>
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Attached Crop Photos ({images.length}/{maxImages})
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Click &times; to remove
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-black aspect-square">
                <img 
                  src={imgUrl} 
                  alt={`Crop preview ${idx + 1}`} 
                  onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-md transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-1 left-1.5 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
                  <span>Photo #{idx + 1}</span>
                  <span className="text-emerald-400">✓ Base64</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

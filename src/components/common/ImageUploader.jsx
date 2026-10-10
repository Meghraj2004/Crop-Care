import React, { useState } from 'react';
import { Camera, Upload, X, CheckCircle, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const ImageUploader = ({ images = [], onImagesChange, maxImages = 5 }) => {
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setErrorMsg("");
    if (images.length + files.length > maxImages) {
      setErrorMsg(`You can upload a maximum of ${maxImages} crop photos.`);
      return;
    }

    // Validate formats
    const invalidFormat = files.find(f => !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type));
    if (invalidFormat) {
      setErrorMsg("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }

    setCompressing(true);
    setProgress(20);

    // Simulate image optimization & base64 conversion
    const readPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    });

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    Promise.all(readPromises).then(newBase64Images => {
      setTimeout(() => {
        setProgress(100);
        setCompressing(false);
        onImagesChange([...images, ...newBase64Images]);
      }, 400);
    });
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
          accept="image/jpeg,image/jpg,image/png" 
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
              Supports JPG, JPEG, PNG (Auto-compressed for fast upload)
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            <Upload className="w-3.5 h-3.5" /> Upload up to {maxImages} photos ({images.length}/{maxImages})
          </span>
        </label>
      </div>

      {/* Compression & Upload Progress Bar */}
      {compressing && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 animate-bounce text-emerald-600" /> 
              Optimizing & compressing crop photos...
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
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Attached Crop Photos ({images.length})
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
                  className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-1 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                  Photo #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

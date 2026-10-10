// Fallback images and helper for resilient image loading across CropCare platform

// Reliable Unsplash agricultural photo URLs with direct CDN optimization
export const CROP_IMAGE_FALLBACKS = {
  tomato: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
  grape: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
  sugarcane: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  onion: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
  cotton: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
  banana: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
  pomegranate: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
  generalCrop: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
  plantDisease: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&w=800&q=80",
  farming: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
};

// SVG Placeholder Data URI used when network / CDN is unreachable
export const SVG_FALLBACK_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300' fill='%23059669'%3E%3Crect width='400' height='300' fill='%23ecfdf5'/%3E%3Cpath d='M200 80c-35 0-60 25-60 60 0 45 60 80 60 80s60-35 60-80c0-35-25-60-60-60zm0 100c-15-20-30-35-30-50 0-18 12-30 30-30s30 12 30 30c0 15-15 30-30 50z' fill='%23059669'/%3E%3Ctext x='200' y='250' font-family='sans-serif' font-size='14' font-weight='bold' fill='%23065f46' text-anchor='middle'%3ECropCare Advisory%3C/text%3E%3C/svg%3E";

export const handleImageError = (e, fallback = CROP_IMAGE_FALLBACKS.generalCrop) => {
  if (!e || !e.currentTarget) return;
  // If fallback already failed, use SVG Data URI to prevent infinite loop
  if (e.currentTarget.src === fallback || e.currentTarget.src.includes('data:image/svg')) {
    e.currentTarget.src = SVG_FALLBACK_DATA_URI;
  } else {
    e.currentTarget.src = fallback;
  }
};

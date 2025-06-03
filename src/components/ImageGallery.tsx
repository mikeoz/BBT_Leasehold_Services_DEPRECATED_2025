
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface PropertyImage {
  image_url: string;
  display_order: number;
  is_cover: boolean;
}

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
  className?: string;
}

const ImageGallery = ({ images, title, className = "" }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sort images: cover photo first, then by display order
  const sortedImages = images?.sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1;
    if (!a.is_cover && b.is_cover) return 1;
    return a.display_order - b.display_order;
  }) || [];

  // Use sorted images or fallback to default image
  const imageUrls = sortedImages.length > 0 
    ? sortedImages.map(img => img.image_url)
    : ["https://images.unsplash.com/photo-1483058712412-4245e9b90334"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  return (
    <div className={className}>
      <div className="relative aspect-video bg-muted rounded-md overflow-hidden mb-4">
        <img 
          src={imageUrls[currentImageIndex]} 
          alt={`${title} - Image ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        
        {imageUrls.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={prevImage}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/80 hover:bg-white"
              onClick={nextImage}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        )}
        
        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white rounded text-sm">
            {currentImageIndex + 1} / {imageUrls.length}
          </div>
        )}
      </div>
      
      {imageUrls.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {imageUrls.map((image, index) => (
            <div 
              key={index} 
              className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 cursor-pointer ${
                index === currentImageIndex ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={image} 
                alt={`${title} - Thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

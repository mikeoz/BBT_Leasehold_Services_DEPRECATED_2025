
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import RentalRequestForm from "@/components/RentalRequestForm";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock property data - would normally come from an API
  const property = {
    id,
    title: id === "1" 
      ? "Lakefront Cabin" 
      : id === "2" 
        ? "Mountain Retreat" 
        : id === "3" 
          ? "Forest Hideaway" 
          : "Beachfront Condo",
    description: id === "1"
      ? "Beautiful 3 bedroom cabin with lake views and private dock. Perfect for a family getaway with spacious living area, fully equipped kitchen, and outdoor fire pit. Enjoy kayaking, swimming, and fishing from your private dock. The cabin features a master bedroom with en-suite bathroom, two guest bedrooms with shared bathroom, and a cozy fireplace in the living room."
      : "Cozy 2 bedroom mountain home with stunning views of the surrounding landscape. The perfect retreat for those seeking peace and tranquility. Featuring a wraparound deck, floor-to-ceiling windows, and an open floor plan. Nearby hiking trails and ski areas make this an ideal location for outdoor enthusiasts.",
    images: [
      id === "1" 
        ? "https://images.unsplash.com/photo-1483058712412-4245e9b90334"
        : "https://images.unsplash.com/photo-1527576539890-dfa815648363",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
    ],
    bedrooms: id === "1" ? 3 : 2,
    bathrooms: id === "1" ? 2 : 1,
    maxGuests: id === "1" ? 6 : 4,
    amenities: [
      "WiFi",
      "Kitchen",
      "Free parking",
      "Air conditioning",
      "Heating",
      "Washer",
      "Dryer",
      id === "1" ? "Lake access" : "Mountain views",
      "Fireplace",
    ],
    rules: [
      "No smoking",
      "No parties",
      "No pets",
      "Check-in after 3:00 PM",
      "Check-out before 11:00 AM",
    ],
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/properties")}
          >
            ← Back to Properties
          </Button>
          <h1 className="text-3xl font-bold">{property.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images and Details */}
          <div>
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden mb-4">
              <img 
                src={property.images[currentImageIndex]} 
                alt={`${property.title} - Image ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
              
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
              
              <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white rounded text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
            
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {property.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 cursor-pointer ${
                    index === currentImageIndex ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={image} 
                    alt={`${property.title} - Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">About This Property</h2>
                <p className="text-muted-foreground">{property.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div>
                  <h3 className="font-semibold mb-1">Bedrooms</h3>
                  <p>{property.bedrooms}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Bathrooms</h3>
                  <p>{property.bathrooms}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Max Guests</h3>
                  <p>{property.maxGuests}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">House Rules</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {property.rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rental Request Form */}
          <div className="sticky top-24">
            <RentalRequestForm 
              propertyId={id || "1"} 
              propertyTitle={property.title}
              maxGuests={property.maxGuests}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;

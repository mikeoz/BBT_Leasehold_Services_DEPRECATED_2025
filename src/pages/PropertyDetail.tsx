
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import RentalRequestForm from "@/components/RentalRequestForm";
import AuthPrompt from "@/components/auth/AuthPrompt";
import ImageGallery from "@/components/ImageGallery";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Edit } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string;
  house_rules: string;
  user_id: string;
  available_dates: string[];
  property_images: Array<{
    image_url: string;
    display_order: number;
    is_cover: boolean;
  }>;
}

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error('Property ID is required');
      
      const { data, error } = await supabase
        .from('rental_listings')
        .select(`
          id,
          title,
          description,
          bedrooms,
          bathrooms,
          max_guests,
          amenities,
          house_rules,
          user_id,
          available_dates,
          property_images:rental_listing_images (
            image_url,
            display_order,
            is_cover
          )
        `)
        .eq('id', id)
        .eq('status', 'available')
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      return data as Property & { available_dates: string[] };
    },
    enabled: !!id,
  });

  // Helper function to safely parse available dates
  const parseAvailableDates = (availableDates: any): string[] => {
    if (!availableDates) return [];
    
    // If it's already an array, return it
    if (Array.isArray(availableDates)) {
      return availableDates;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof availableDates === 'string') {
      try {
        const parsed = JSON.parse(availableDates);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error('Error parsing available_dates:', e);
        return [];
      }
    }
    
    return [];
  };

  // Helper function to safely parse amenities and house rules
  const parseListData = (data: string): string[] => {
    if (!data) return [];
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // If JSON parsing fails, treat as comma-separated string
    }
    
    // Split by comma and clean up
    return data.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  // Check if current user is the property owner
  const isPropertyOwner = user && property && user.id === property.user_id;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading property details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !property) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Property not found or error loading property details.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/properties")}
            >
              ← Back to Properties
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Parse amenities, house rules, and available dates safely
  const amenitiesList = parseListData(property.amenities);
  const rulesList = parseListData(property.house_rules);
  const availableDatesArray = parseAvailableDates(property.available_dates);

  console.log('Parsed available dates:', availableDatesArray);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/properties")}
            >
              ← Back to Properties
            </Button>
            <h1 className="text-3xl font-bold">{property.title}</h1>
          </div>
          
          {isPropertyOwner && (
            <Link to={`/edit-listing/${property.id}`}>
              <Button className="flex items-center gap-2">
                <Edit size={16} />
                Edit Property
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images and Details */}
          <div>
            <ImageGallery 
              images={property.property_images || []}
              title={property.title}
            />
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">About This Property</h2>
                <p className="text-muted-foreground">{property.description || "No description available"}</p>
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
                  <p>{property.max_guests}</p>
                </div>
              </div>
              
              {amenitiesList.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {amenitiesList.map((amenity: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {rulesList.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">House Rules</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {rulesList.map((rule: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rental Request Form or Back Button for Property Owner */}
          <div className="sticky top-24">
            {isPropertyOwner ? (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Property Owner View</h3>
                <p className="text-muted-foreground mb-6">
                  You are viewing your own property. Use the "Edit Property" button above to make changes.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/properties")}
                >
                  ← Back to Properties
                </Button>
              </div>
            ) : user ? (
              <RentalRequestForm 
                propertyId={property.id} 
                propertyTitle={property.title}
                maxGuests={property.max_guests}
                availableDates={availableDatesArray}
              />
            ) : (
              <AuthPrompt 
                title="Request to Stay"
                description="Sign in or create an account to request a booking for this property"
                context="rental"
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;

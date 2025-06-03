
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import PropertyCard from "@/components/PropertyCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SeedDataButton from "@/components/admin/SeedDataButton";

interface Property {
  id: string;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  user_id: string;
  property_images: Array<{
    image_url: string;
    display_order: number;
    is_cover: boolean;
  }>;
}

const Properties = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: properties = [], isLoading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          bedrooms,
          bathrooms,
          max_guests,
          user_id,
          property_images (
            image_url,
            display_order,
            is_cover
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data as Property[];
    },
  });

  const handleDelete = () => {
    // Invalidate both properties and user-properties queries
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['user-properties'] });
    refetch();
  };

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (property.description && property.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading properties...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading properties. Please try again.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Available Properties</h1>
            <SeedDataButton />
          </div>
          <p className="text-muted-foreground mb-6">
            Browse our community's exclusive private rental properties
          </p>

          <div className="relative">
            <Input
              type="search"
              placeholder="Search properties..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">
              {properties.length === 0 ? "No properties available" : "No properties found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {properties.length === 0 
                ? "Click 'Add Property' above to add a new property!" 
                : "Try adjusting your search criteria"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                currentUserId={user?.id}
                showEditButton={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Properties;

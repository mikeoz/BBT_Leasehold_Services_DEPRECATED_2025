import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SeedDataButton from "@/components/admin/SeedDataButton";

interface Property {
  id: string;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_images: Array<{
    image_url: string;
    display_order: number;
  }>;
}

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: properties = [], isLoading, error } = useQuery({
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
          property_images (
            image_url,
            display_order
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
                ? "Click 'Create Sample Properties' above to add some demo data!" 
                : "Try adjusting your search criteria"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => {
              const sortedImages = property.property_images?.sort((a, b) => a.display_order - b.display_order) || [];
              const primaryImage = sortedImages[0]?.image_url || "https://images.unsplash.com/photo-1483058712412-4245e9b90334";
              
              return (
                <Card key={property.id} className="overflow-hidden card-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={primaryImage} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <CardHeader>
                    <CardTitle>{property.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {property.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">{property.bedrooms}</span>
                        <span className="ml-1 text-muted-foreground">bed{property.bedrooms !== 1 && 's'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{property.bathrooms}</span>
                        <span className="ml-1 text-muted-foreground">bath{property.bathrooms !== 1 && 's'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{property.max_guests}</span>
                        <span className="ml-1 text-muted-foreground">guest{property.max_guests !== 1 && 's'}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Link to={`/properties/${property.id}`} className="w-full">
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Properties;

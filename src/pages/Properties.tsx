
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

interface Property {
  id: string;
  title: string;
  description: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
}

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - in a real app this would come from an API
  const properties: Property[] = [
    {
      id: "1",
      title: "Lakefront Cabin",
      description: "Beautiful 3 bedroom cabin with lake views and private dock.",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
    },
    {
      id: "2",
      title: "Mountain Retreat",
      description: "Cozy 2 bedroom mountain home with stunning views.",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
    },
    {
      id: "3",
      title: "Forest Hideaway",
      description: "Secluded 4 bedroom house nestled in the woods.",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      bedrooms: 4,
      bathrooms: 2.5,
      maxGuests: 8,
    },
    {
      id: "4",
      title: "Beachfront Condo",
      description: "Modern 2 bedroom condo with direct beach access.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
    },
  ];

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    property.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Available Properties</h1>
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
            <h2 className="text-xl font-medium mb-2">No properties found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden card-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <CardHeader>
                  <CardTitle>{property.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{property.description}</CardDescription>
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
                      <span className="font-medium">{property.maxGuests}</span>
                      <span className="ml-1 text-muted-foreground">guest{property.maxGuests !== 1 && 's'}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link to={`/properties/${property.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Properties;

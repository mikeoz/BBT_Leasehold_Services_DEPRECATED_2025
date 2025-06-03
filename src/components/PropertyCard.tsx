
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface PropertyImage {
  image_url: string;
  display_order: number;
  is_cover: boolean;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    max_guests: number;
    user_id: string;
    status?: string;
    property_images?: PropertyImage[];
    rental_requests?: Array<{ id: string; status: string; }>;
  };
  currentUserId?: string;
  showEditButton?: boolean;
  showManageAvailability?: boolean;
  showPendingRequests?: boolean;
}

const PropertyCard = ({ 
  property, 
  currentUserId, 
  showEditButton = false, 
  showManageAvailability = false,
  showPendingRequests = false 
}: PropertyCardProps) => {
  // Find cover photo first, then fallback to first image by display order
  const coverImage = property.property_images?.find(img => img.is_cover);
  const sortedImages = property.property_images?.sort((a, b) => a.display_order - b.display_order) || [];
  const primaryImage = coverImage?.image_url || sortedImages[0]?.image_url || "https://images.unsplash.com/photo-1483058712412-4245e9b90334";
  
  // Check if current user owns this property
  const isOwner = currentUserId && property.user_id === currentUserId;
  const pendingRequests = property.rental_requests?.filter(req => req.status === 'pending').length || 0;

  return (
    <Card className="overflow-hidden card-shadow">
      <div className="aspect-video relative">
        <img 
          src={primaryImage} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        {property.status && (
          <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
            property.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
          }`}>
            {property.status === "active" ? "Active" : "Inactive"}
          </div>
        )}
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
            <span className="ml-1 text-muted-foreground">bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{property.bathrooms}</span>
            <span className="ml-1 text-muted-foreground">bath{property.bathrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">{property.max_guests}</span>
            <span className="ml-1 text-muted-foreground">guest{property.max_guests !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {showPendingRequests && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">Pending Requests:</span>
            {pendingRequests > 0 ? (
              <span className="bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                {pendingRequests}
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">None</span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Link to={`/properties/${property.id}`} className="flex-1">
          <Button className="w-full">View Details</Button>
        </Link>
        {isOwner && showEditButton && (
          <Link to={`/edit-listing/${property.id}`}>
            <Button variant="outline" size="sm">Edit</Button>
          </Link>
        )}
        {isOwner && showManageAvailability && (
          <Link to={`/manage-availability/${property.id}`}>
            <Button variant="outline" size="sm">Manage Availability</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;

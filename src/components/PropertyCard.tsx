
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Clock } from "lucide-react";

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
  onDelete?: () => void;
  onViewRequests?: () => void;
}

const PropertyCard = ({ 
  property, 
  currentUserId, 
  showEditButton = false, 
  showManageAvailability = false,
  showPendingRequests = false,
  onDelete,
  onViewRequests
}: PropertyCardProps) => {
  const { toast } = useToast();
  
  // Find cover photo first, then fallback to first image by display order
  const coverImage = property.property_images?.find(img => img.is_cover);
  const sortedImages = property.property_images?.sort((a, b) => a.display_order - b.display_order) || [];
  const primaryImage = coverImage?.image_url || sortedImages[0]?.image_url || "https://images.unsplash.com/photo-1483058712412-4245e9b90334";
  
  // Check if current user owns this property
  const isOwner = currentUserId && property.user_id === currentUserId;
  const pendingRequests = property.rental_requests?.filter(req => req.status === 'pending').length || 0;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'deleted' })
        .eq('id', property.id)
        .eq('user_id', currentUserId); // Extra security check

      if (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Property has been deleted successfully.",
      });

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewRequests = () => {
    if (onViewRequests) {
      onViewRequests();
    }
  };

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
        
        {showPendingRequests && pendingRequests > 0 && (
          <div className="flex items-center justify-between mt-3 p-2 bg-accent/10 rounded-md">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium">
                {pendingRequests} pending request{pendingRequests !== 1 ? 's' : ''}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewRequests}
              className="text-xs"
            >
              View Requests
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Link to={`/properties/${property.id}`} className="flex-1">
            <Button className="w-full">View Details</Button>
          </Link>
          {isOwner && showEditButton && (
            <Link to={`/edit-listing/${property.id}`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          )}
        </div>
        
        {isOwner && (showManageAvailability || onDelete) && (
          <div className="flex gap-2 w-full">
            {showManageAvailability && (
              <Link to={`/manage-availability/${property.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Manage Availability</Button>
              </Link>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Property</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{property.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;

import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import RentalRequestActions from "@/components/RentalRequestActions";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PropertyListing {
  id: string;
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  user_id: string;
  status: string;
  property_images: Array<{
    image_url: string;
    display_order: number;
    is_cover: boolean;
  }>;
  rental_requests: Array<{
    id: string;
    status: string;
  }>;
}

interface RentalRequest {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests: number;
  message: string;
  status: string;
  created_at: string;
  properties: {
    title: string;
  };
  renter_profiles: {
    email: string | null;
    full_name: string | null;
  } | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("properties");

  // Fetch user's properties (excluding deleted ones)
  const { data: listings = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['user-properties', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rental_listings')
        .select(`
          id,
          title,
          description,
          bedrooms,
          bathrooms,
          max_guests,
          user_id,
          status,
          rental_listing_images (
            image_url,
            display_order,
            is_cover
          ),
          rental_requests (
            id,
            status
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data as PropertyListing[];
    },
    enabled: !!user,
  });

  // Fetch rental requests for user's properties
  const { data: rentalRequests = [], isLoading: requestsLoading, refetch: refetchRequests } = useQuery({
    queryKey: ['rental-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('rental_requests')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guests,
          message,
          status,
          created_at,
          properties!inner (
            title,
            user_id
          ),
          renter_profiles!rental_requests_renter_id_fkey (
            email,
            full_name
          )
        `)
        .eq('properties.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rental requests:', error);
        throw error;
      }

      return data as RentalRequest[];
    },
    enabled: !!user,
  });

  const handleDelete = () => {
    // Invalidate both properties and user-properties queries
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['user-properties'] });
  };

  const handleViewRequests = () => {
    setActiveTab("requests");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
          <Link to="/create-listing">
            <Button>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Listing
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="requests">Rental Requests</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            {propertiesLoading ? (
              <div className="text-center py-8">
                <p>Loading properties...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No properties yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first property listing to get started!
                </p>
                <Link to="/create-listing">
                  <Button>Create Your First Listing</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    property={listing}
                    currentUserId={user?.id}
                    showEditButton={true}
                    showManageAvailability={true}
                    showPendingRequests={true}
                    onDelete={handleDelete}
                    onViewRequests={handleViewRequests}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Rental Requests</CardTitle>
                <CardDescription>
                  View and manage requests from potential renters.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="text-center py-4">
                    <p>Loading requests...</p>
                  </div>
                ) : rentalRequests.length === 0 ? (
                  <div className="rounded-md border">
                    <div className="p-4 text-center text-muted-foreground">
                      You have no rental requests at this time.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rentalRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{request.properties.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-2">
                          <div>Check-in: {new Date(request.check_in_date).toLocaleDateString()}</div>
                          <div>Check-out: {new Date(request.check_out_date).toLocaleDateString()}</div>
                          <div>Guests: {request.guests}</div>
                          <div>Requester: {request.renter_profiles?.full_name || request.renter_profiles?.email || 'Unknown'}</div>
                        </div>
                        {request.message && (
                          <div className="text-sm mb-2">
                            <strong>Message:</strong> {request.message}
                          </div>
                        )}
                        <RentalRequestActions
                          requestId={request.id}
                          currentStatus={request.status}
                          onStatusUpdate={refetchRequests}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your profile and account preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>Email:</div>
                    <div>{user?.email || 'Not available'}</div>
                    <div>User ID:</div>
                    <div className="text-xs break-all">{user?.id || 'Not available'}</div>
                    <div>Account Created:</div>
                    <div>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Not available'}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Agreements</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Agreed to Community Charter
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Agreed to Rules and Regulations
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Edit Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

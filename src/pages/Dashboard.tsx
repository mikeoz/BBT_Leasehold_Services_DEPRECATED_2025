
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
import { useAuth } from "@/contexts/AuthContext";

interface PropertyListing {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "inactive";
  pendingRequests: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<PropertyListing[]>([
    {
      id: "1",
      title: "Lakefront Cabin",
      description: "Beautiful 3 bedroom cabin with lake views and private dock.",
      image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
      status: "active",
      pendingRequests: 2,
    },
    {
      id: "2",
      title: "Mountain Retreat",
      description: "Cozy 2 bedroom mountain home with stunning views.",
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
      status: "inactive",
      pendingRequests: 0,
    }
  ]);

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

        <Tabs defaultValue="properties">
          <TabsList className="mb-6">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="requests">Rental Requests</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden card-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                      listing.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                    }`}>
                      {listing.status === "active" ? "Active" : "Inactive"}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle>{listing.title}</CardTitle>
                    <CardDescription>{listing.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Pending Requests:</span>
                      {listing.pendingRequests > 0 ? (
                        <span className="bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                          {listing.pendingRequests}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Link to={`/edit-listing/${listing.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Link to={`/manage-availability/${listing.id}`}>
                      <Button variant="outline" size="sm">Manage Availability</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
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
                <div className="rounded-md border">
                  <div className="p-4 text-center text-muted-foreground">
                    You have no pending rental requests at this time.
                  </div>
                </div>
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

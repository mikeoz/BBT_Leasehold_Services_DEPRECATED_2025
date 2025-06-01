
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type Status = "available" | "unavailable" | "booked";

interface CalendarDay {
  date: Date;
  status: Status;
}

const ManageAvailability = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<Status>("available");
  const [availability, setAvailability] = useState<CalendarDay[]>([]);

  // Mock property data - would normally come from an API
  const property = {
    id,
    title: id === "1" ? "Lakefront Cabin" : "Mountain Retreat",
    image: id === "1" 
      ? "https://images.unsplash.com/photo-1483058712412-4245e9b90334"
      : "https://images.unsplash.com/photo-1527576539890-dfa815648363",
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    setAvailability((current) => {
      // Check if this date is already in the array
      const existingIndex = current.findIndex(
        (day) => format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      );
      
      if (existingIndex >= 0) {
        // Update existing date's status
        const updated = [...current];
        updated[existingIndex] = { ...updated[existingIndex], status: selectedStatus };
        return updated;
      } else {
        // Add new date with selected status
        return [...current, { date, status: selectedStatus }];
      }
    });
    
    toast.success(`${format(date, "MMMM d, yyyy")} marked as ${selectedStatus}`);
  };

  const getDateClassNames = (date: Date) => {
    const dayAvailability = availability.find(
      (day) => format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    
    if (!dayAvailability) return "";
    
    switch (dayAvailability.status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "unavailable":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case "booked":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "";
    }
  };

  const saveAvailability = () => {
    // This would normally send the data to an API
    console.log("Saving availability:", availability);
    
    toast.success("Availability saved successfully!");
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Manage Availability</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Set Property Availability</CardTitle>
                <CardDescription>
                  Click on dates to mark them as available, unavailable, or booked.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button 
                    variant={selectedStatus === "available" ? "default" : "outline"}
                    onClick={() => setSelectedStatus("available")}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Available
                  </Button>
                  <Button 
                    variant={selectedStatus === "unavailable" ? "default" : "outline"}
                    onClick={() => setSelectedStatus("unavailable")}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                    Unavailable
                  </Button>
                  <Button 
                    variant={selectedStatus === "booked" ? "default" : "outline"}
                    onClick={() => setSelectedStatus("booked")}
                    className="flex items-center"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Booked
                  </Button>
                </div>
                
                <div className="border rounded-md p-4">
                  <Calendar
                    mode="single"
                    onSelect={handleSelectDate}
                    className="p-3 pointer-events-auto"
                    modifiers={{
                      available: (date) => 
                        availability.some(day => 
                          format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && 
                          day.status === "available"
                        ),
                      unavailable: (date) => 
                        availability.some(day => 
                          format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && 
                          day.status === "unavailable"
                        ),
                      booked: (date) => 
                        availability.some(day => 
                          format(day.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && 
                          day.status === "booked"
                        ),
                    }}
                    modifiersClassNames={{
                      available: "bg-green-100 text-green-800 hover:bg-green-200",
                      unavailable: "bg-gray-100 text-gray-800 hover:bg-gray-200",
                      booked: "bg-blue-100 text-blue-800 hover:bg-blue-200",
                    }}
                  />
                </div>
                
                <div className="mt-6">
                  <Button onClick={saveAvailability} className="w-full">
                    Save Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium mb-2">{property.title}</h3>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Available Dates</h4>
                    {availability.filter(day => day.status === "available").length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {availability
                          .filter(day => day.status === "available")
                          .slice(0, 3)
                          .map((day, i) => (
                            <li key={i} className="text-green-600">
                              {format(day.date, "MMMM d, yyyy")}
                            </li>
                          ))}
                        {availability.filter(day => day.status === "available").length > 3 && (
                          <li className="text-muted-foreground">
                            +{availability.filter(day => day.status === "available").length - 3} more
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No available dates set</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Booked Dates</h4>
                    {availability.filter(day => day.status === "booked").length > 0 ? (
                      <ul className="text-sm space-y-1">
                        {availability
                          .filter(day => day.status === "booked")
                          .slice(0, 3)
                          .map((day, i) => (
                            <li key={i} className="text-blue-600">
                              {format(day.date, "MMMM d, yyyy")}
                            </li>
                          ))}
                        {availability.filter(day => day.status === "booked").length > 3 && (
                          <li className="text-muted-foreground">
                            +{availability.filter(day => day.status === "booked").length - 3} more
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No booked dates set</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageAvailability;


import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/layout/MainLayout";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const reservationSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  message: z.string().optional(),
  checkInDate: z.date({
    required_error: "Check-in date is required.",
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required.",
  }),
}).refine((data) => {
  return data.checkOutDate > data.checkInDate;
}, {
  message: "Check-out date must be after check-in date.",
  path: ["checkOutDate"],
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Mock available dates - would normally come from an API
  const disabledDates = {
    before: new Date(),
    after: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  };

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // This would normally send the data to an API
      console.log("Reservation data:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Reservation request submitted successfully!");
      
      // In a real application, this would trigger emails to:
      // 1. The potential renter
      // 2. The community rental secretary
      // 3. The landlord (forwarded by the rental secretary)
      
      navigate("/properties");
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("Failed to submit reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Reservation Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Request a Reservation</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="checkInDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-in Date</FormLabel>
                          <div className="border rounded-md p-2">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={disabledDates}
                              className={`p-0 pointer-events-auto ${!field.value ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {field.value && (
                            <p className="text-sm mt-1">
                              Selected: {format(field.value, "MMMM d, yyyy")}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="checkOutDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Check-out Date</FormLabel>
                          <div className="border rounded-md p-2">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={disabledDates}
                              className={`p-0 pointer-events-auto ${!field.value ? 'border-red-500' : ''}`}
                            />
                          </div>
                          {field.value && (
                            <p className="text-sm mt-1">
                              Selected: {format(field.value, "MMMM d, yyyy")}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requests or questions..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-secondary/50 p-4 rounded-md text-sm space-y-2">
                    <p className="font-medium">By submitting this request:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>You acknowledge that this is a members-only community for private residences.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="h-4 w-4 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>You agree to abide by all community rules and regulations during your stay.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Reservation Request"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetail;

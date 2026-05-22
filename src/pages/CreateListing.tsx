import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import MainLayout from "@/components/layout/MainLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { uploadPropertyImage } from "@/utils/imageUpload";

const amenitiesList = [
  "WiFi", "Pool", "Hot Tub", "Fireplace", "Kitchen", "Washer/Dryer", 
  "Parking", "Air Conditioning", "Heating", "TV", "Gym", "Balcony/Patio"
];

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  bedrooms: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Must be a valid number greater than 0.",
  }),
  bathrooms: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Must be a valid number greater than 0.",
  }),
  maxGuests: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Must be a valid number greater than 0.",
  }),
  amenities: z.array(z.string()).default([]),
  houseRules: z.string(),
  images: z.any(),
  minimalStayDays: z.string(),
  pricingType: z.enum(["daily", "weekly"]),
  rentalRate: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Must be a valid number greater than 0.",
  }),
  availableDates: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      bedrooms: "1",
      bathrooms: "1",
      maxGuests: "2",
      amenities: [],
      houseRules: "",
      images: undefined,
      minimalStayDays: "1",
      pricingType: "daily",
      rentalRate: "100",
      availableDates: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }
    
    const newPreviewUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    }
    
    setPreviewUrls(newPreviewUrls);
    setCoverPhotoIndex(0); // Reset cover photo to first image
    form.setValue("images", files);
  };

  const handleAvailabilityChange = (dates: string[]) => {
    setAvailableDates(dates);
    form.setValue("availableDates", dates);
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    console.log("Debug: Starting property creation");
    console.log("Debug: Current user from auth context:", {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    });

    setIsLoading(true);
    
    try {
      // First, verify the user exists in auth.users by checking the current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Debug: Session error:", sessionError);
        throw new Error("Authentication session is invalid. Please log out and log back in.");
      }
      
      if (!sessionData.session?.user) {
        console.error("Debug: No active session found");
        throw new Error("No active session found. Please log out and log back in.");
      }
      
      const sessionUserId = sessionData.session.user.id;
      console.log("Debug: Session user ID:", sessionUserId);
      console.log("Debug: Auth context user ID:", user.id);
      
      if (sessionUserId !== user.id) {
        console.error("Debug: User ID mismatch between session and auth context");
        throw new Error("Authentication mismatch detected. Please log out and log back in.");
      }
      
      console.log("Debug: Creating property with verified user ID:", sessionUserId);
      console.log("Debug: Property data:", data);
      
      const { data: property, error: propertyError } = await supabase
        .from('rental_listings')
        .insert({
          user_id: sessionUserId, // Use the verified session user ID
          title: data.title,
          description: data.description,
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseFloat(data.bathrooms),
          max_guests: parseInt(data.maxGuests),
          amenities: data.amenities.join(", "),
          house_rules: data.houseRules || null,
          minimal_stay_days: parseInt(data.minimalStayDays),
          pricing_type: data.pricingType,
          rental_rate: parseInt(data.rentalRate),
          available_dates: JSON.stringify(availableDates),
          status: 'active'
        })
        .select()
        .single();

      if (propertyError) {
        console.error("Debug: Property creation error:", propertyError);
        
        // Provide specific error messages based on the error type
        if (propertyError.code === '23503' && propertyError.message.includes('properties_user_id_fkey')) {
          throw new Error("Authentication error: Your user account is not properly registered. Please contact support or try logging out and back in.");
        }
        
        throw propertyError;
      }

      console.log("Debug: Property created successfully:", property);

      if (data.images && data.images.length > 0) {
        console.log("Uploading images, cover photo index:", coverPhotoIndex);
        
        const uploadPromises = Array.from(data.images).map(async (file: File, index: number) => {
          const uploadResult = await uploadPropertyImage(file, user.id, property.id, index);
          
          if (uploadResult.error) {
            console.error(`Failed to upload image ${index + 1}:`, uploadResult.error);
            return null;
          }

          console.log(`Adding image ${index + 1} to database:`, uploadResult.url, "Is cover:", index === coverPhotoIndex);
          
          return supabase
            .from('rental_listing_images')
            .insert({
              property_id: property.id,
              image_url: uploadResult.url,
              display_order: index,
              is_cover: index === coverPhotoIndex
            });
        });

        const imageResults = await Promise.all(uploadPromises);
        const imageErrors = imageResults.filter(result => result === null || result?.error);
        
        if (imageErrors.length > 0) {
          console.error("Some images failed to save:", imageErrors);
          toast.error(`${imageErrors.length} image(s) failed to upload`);
        } else {
          console.log("All images uploaded and saved successfully with cover photo set");
        }
      }
      
      toast.success("Property listing created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Debug: Error creating listing:", error);
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create listing. Please try again or contact support if the problem persists.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add a check to ensure user is properly authenticated before showing the form
  if (!user) {
    return (
      <MainLayout>
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You must be logged in to create a property listing.
            </p>
            <Button onClick={() => navigate("/auth")}>
              Go to Login
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create Property Listing</h1>
          <p className="text-muted-foreground">
            Add details about your property to create a new listing.
          </p>
          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Logged in as: {user.email} (ID: {user.id})
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Lakefront Cabin with Mountain Views" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your property, including location highlights and special features..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" min="0.5" step="0.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Guests</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select max guests" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                          <SelectItem value="11">10+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="amenities"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Amenities</FormLabel>
                      <FormDescription>
                        Select all amenities available at your property
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {amenitiesList.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="amenities"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimalStayDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimal Stay (Days)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select minimal stay" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">No minimum</SelectItem>
                          {[...Array(7)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} day{i === 0 ? '' : 's'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentalRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Rate (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          placeholder="100"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="pricingType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Pricing Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <Label htmlFor="daily">Daily Price</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">Weekly Price</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="houseRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House Rules</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="E.g., No smoking, No pets, Quiet hours after 10 PM..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      List any specific rules for your property
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="images"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Property Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload 1-5 high-quality images of your property. Supported formats: JPEG, PNG, WebP, GIF (max 5MB each)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {previewUrls.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Image Previews:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 right-2">
                          <Button
                            type="button"
                            size="sm"
                            variant={coverPhotoIndex === index ? "default" : "outline"}
                            className="w-full text-xs"
                            onClick={() => setCoverPhotoIndex(index)}
                          >
                            {coverPhotoIndex === index ? "Cover Photo" : "Set as Cover"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click "Set as Cover" to choose which image appears on the Properties page
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <FormLabel className="text-base">Available Dates</FormLabel>
                  <FormDescription>
                    Click on dates to select available periods. Set up availability month by month.
                  </FormDescription>
                </div>
                <AvailabilityCalendar 
                  selectedDates={availableDates}
                  onDatesChange={handleAvailabilityChange}
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-bold text-center">
                  All community rentals are subject to, and based on the agreement to follow, community rules and regulations.
                </p>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Listing"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateListing;

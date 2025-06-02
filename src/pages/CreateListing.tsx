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

    setIsLoading(true);
    
    try {
      console.log("Creating property with data:", data);
      
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
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
        console.error("Error creating property:", propertyError);
        throw propertyError;
      }

      console.log("Property created successfully:", property);

      if (data.images && data.images.length > 0) {
        const imagePromises = Array.from(data.images).map((file: File, index: number) => {
          const placeholderUrl = `https://images.unsplash.com/photo-${1483058712412 + index}-4245e9b90334`;
          
          return supabase
            .from('property_images')
            .insert({
              property_id: property.id,
              image_url: placeholderUrl,
              display_order: index,
              is_cover: index === coverPhotoIndex
            });
        });

        const imageResults = await Promise.all(imagePromises);
        const imageErrors = imageResults.filter(result => result.error);
        
        if (imageErrors.length > 0) {
          console.error("Some images failed to save:", imageErrors);
        }
      }
      
      toast.success("Property listing created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create Property Listing</h1>
          <p className="text-muted-foreground">
            Add details about your property to create a new listing.
          </p>
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
                      Upload 1-5 high-quality images of your property
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

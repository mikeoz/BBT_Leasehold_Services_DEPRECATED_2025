import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { X, Crown } from "lucide-react";
import { uploadPropertyImage, deletePropertyImage } from "@/utils/imageUpload";

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
  minimalStayDays: z.string(),
  pricingType: z.enum(["daily", "weekly"]),
  rentalRate: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, {
    message: "Must be a valid number greater than 0.",
  }),
  availableDates: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

interface ExistingImage {
  id: string;
  image_url: string;
  display_order: number;
  is_cover: boolean;
}

interface NewImagePreview {
  file: File;
  preview: string;
  isCover: boolean;
}

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(true);
  const [newImages, setNewImages] = useState<NewImagePreview[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [coverImageId, setCoverImageId] = useState<string>("");
  const [newCoverIndex, setNewCoverIndex] = useState<number>(-1);

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
      minimalStayDays: "1",
      pricingType: "daily",
      rentalRate: "100",
      availableDates: [],
    },
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || !user) return;

      try {
        console.log("Fetching property with ID:", id);
        const { data: property, error } = await supabase
          .from('rental_listings')
          .select(`
            *,
            property_images:rental_listing_images (
              id,
              image_url,
              display_order,
              is_cover
            )
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching property:", error);
          throw error;
        }

        if (property) {
          console.log("Property data:", property);
          const amenitiesArray = property.amenities ? property.amenities.split(", ") : [];
          
          let availableDatesArray: string[] = [];
          if (property.available_dates) {
            try {
              if (typeof property.available_dates === 'string') {
                availableDatesArray = JSON.parse(property.available_dates);
              } else if (Array.isArray(property.available_dates)) {
                const isStringArray = property.available_dates.every((item: any) => typeof item === 'string');
                if (isStringArray) {
                  availableDatesArray = property.available_dates as string[];
                }
              }
            } catch (e) {
              console.warn('Failed to parse available_dates:', e);
              availableDatesArray = [];
            }
          }
          
          form.reset({
            title: property.title,
            description: property.description || "",
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            maxGuests: property.max_guests.toString(),
            amenities: amenitiesArray,
            houseRules: property.house_rules || "",
            minimalStayDays: property.minimal_stay_days?.toString() || "1",
            pricingType: property.pricing_type as "daily" | "weekly",
            rentalRate: property.rental_rate?.toString() || "100",
            availableDates: availableDatesArray,
          });
          
          setAvailableDates(availableDatesArray);
          
          // Set existing images
          const sortedImages = property.property_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
          console.log("Existing images:", sortedImages);
          setExistingImages(sortedImages);
          
          // Find cover image
          const coverImage = sortedImages.find((img: any) => img.is_cover);
          if (coverImage) {
            console.log("Setting cover image:", coverImage.id);
            setCoverImageId(coverImage.id);
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property details");
        navigate("/dashboard");
      } finally {
        setIsLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [id, user, form, navigate]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setNewImages([]);
      return;
    }
    
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images at once");
      return;
    }
    
    console.log("Selected files:", files);
    const filesArray = Array.from(files);
    
    const newImagePreviews: NewImagePreview[] = filesArray.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isCover: index === 0 && existingImages.length === 0 // First image is cover if no existing images
    }));
    
    setNewImages(newImagePreviews);
    
    // If first new image and no existing cover, set it as cover
    if (newImagePreviews.length > 0 && !coverImageId && existingImages.length === 0) {
      setNewCoverIndex(0);
    }
    
    console.log("New image previews created:", newImagePreviews.length);
  };

  const removeNewImage = (index: number) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(newImages[index].preview);
    
    setNewImages(updatedImages);
    
    // If removed image was cover, reset cover selection
    if (newCoverIndex === index) {
      setNewCoverIndex(-1);
    } else if (newCoverIndex > index) {
      setNewCoverIndex(newCoverIndex - 1);
    }
  };

  const deleteExistingImage = async (imageId: string) => {
    console.log("Deleting existing image:", imageId);
    
    // Find the image to get its path for storage deletion
    const imageToDelete = existingImages.find(img => img.id === imageId);
    if (imageToDelete) {
      // Extract storage path from URL
      const url = new URL(imageToDelete.image_url);
      const pathParts = url.pathname.split('/');
      const storagePath = pathParts.slice(-2).join('/'); // Get userId/filename
      
      // Delete from storage
      await deletePropertyImage(storagePath);
    }
    
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setImagesToDelete(prev => [...prev, imageId]);
    
    // If deleted image was cover, reset cover selection
    if (coverImageId === imageId) {
      setCoverImageId("");
    }
  };

  const makeCoverImage = (imageId: string) => {
    console.log("Setting cover image:", imageId);
    setCoverImageId(imageId);
    setNewCoverIndex(-1); // Clear new image cover selection
    toast.success("Cover photo updated");
  };

  const makeNewImageCover = (index: number) => {
    console.log("Setting new image as cover:", index);
    setNewCoverIndex(index);
    setCoverImageId(""); // Clear existing image cover selection
    toast.success("Cover photo will be set when saved");
  };

  const handleAvailabilityChange = (dates: string[]) => {
    setAvailableDates(dates);
    form.setValue("availableDates", dates);
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user || !id) {
      toast.error("You must be logged in to edit a listing");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Updating property with data:", data);
      
      // Update property details
      const { error: propertyError } = await supabase
        .from('rental_listings')
        .update({
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (propertyError) {
        console.error("Error updating property:", propertyError);
        throw propertyError;
      }

      // Delete marked images from database
      if (imagesToDelete.length > 0) {
        console.log("Deleting images:", imagesToDelete);
        const { error: deleteError } = await supabase
          .from('rental_listing_images')
          .delete()
          .in('id', imagesToDelete);
        
        if (deleteError) {
          console.error("Error deleting images:", deleteError);
        }
      }

      // Handle new images
      if (newImages.length > 0) {
        console.log("Uploading new images:", newImages.length);
        const currentImageCount = existingImages.length - imagesToDelete.length;
        
        const uploadPromises = newImages.map(async (imageData, index) => {
          const uploadResult = await uploadPropertyImage(imageData.file, user.id, id, currentImageCount + index);
          
          if (uploadResult.error) {
            console.error(`Failed to upload image ${index + 1}:`, uploadResult.error);
            return null;
          }

          console.log(`Adding image ${index + 1} to database:`, uploadResult.url);
          
          return supabase
            .from('rental_listing_images')
            .insert({
              property_id: id,
              image_url: uploadResult.url,
              display_order: currentImageCount + index,
              is_cover: newCoverIndex === index // Set as cover if this is the selected new cover
            });
        });

        const imageResults = await Promise.all(uploadPromises);
        const imageErrors = imageResults.filter(result => result === null || result?.error);
        
        if (imageErrors.length > 0) {
          console.error("Some images failed to save:", imageErrors);
          toast.error(`${imageErrors.length} image(s) failed to upload`);
        } else {
          console.log("All new images uploaded and saved successfully");
        }
      }

      // Update cover image status for existing images
      if (coverImageId && existingImages.some(img => img.id === coverImageId)) {
        console.log("Updating cover image status for existing image:", coverImageId);
        
        // First, remove cover status from all existing images for this property
        await supabase
          .from('rental_listing_images')
          .update({ is_cover: false })
          .eq('property_id', id);
        
        // Then set the selected image as cover
        const { error: coverError } = await supabase
          .from('rental_listing_images')
          .update({ is_cover: true })
          .eq('id', coverImageId);
          
        if (coverError) {
          console.error("Error setting cover image:", coverError);
        }
      }
      
      toast.success("Property listing updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProperty) {
    return (
      <MainLayout>
        <div className="container max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading property details...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edit Property Listing</h1>
          <p className="text-muted-foreground">
            Update your property details and settings.
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                        value={field.value}
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

              {/* Existing Images Section */}
              {existingImages.length > 0 && (
                <div>
                  <FormLabel className="text-base">Current Images</FormLabel>
                  <FormDescription className="mb-4">
                    Click the crown to set an image as the cover photo. Click X to delete.
                  </FormDescription>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <img 
                          src={image.image_url} 
                          alt="Property image" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 right-2 flex justify-between">
                          <Button
                            type="button"
                            size="sm"
                            variant={coverImageId === image.id ? "default" : "outline"}
                            className="p-1 h-auto"
                            onClick={() => makeCoverImage(image.id)}
                            title="Make Cover Photo"
                          >
                            <Crown size={14} className={coverImageId === image.id ? "fill-current text-yellow-400" : ""} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="p-1 h-auto"
                            onClick={() => deleteExistingImage(image.id)}
                            title="Delete Image"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        {coverImageId === image.id && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs bg-yellow-500 text-white p-1 rounded text-center font-medium">
                              Cover Photo
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add New Images Section */}
              <div>
                <FormLabel className="text-base">Add New Images</FormLabel>
                <FormDescription className="mb-4">
                  Upload up to 5 new images to add to your property. Supported formats: JPEG, PNG, WebP, GIF (max 5MB each)
                </FormDescription>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewImageChange}
                  className="mb-4"
                />
              </div>
              
              {newImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">New Image Previews:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {newImages.map((imageData, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                        <img 
                          src={imageData.preview} 
                          alt={`New image preview ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 right-2 flex justify-between">
                          <Button
                            type="button"
                            size="sm"
                            variant={newCoverIndex === index ? "default" : "outline"}
                            className="p-1 h-auto"
                            onClick={() => makeNewImageCover(index)}
                            title="Make Cover Photo"
                          >
                            <Crown size={14} className={newCoverIndex === index ? "fill-current text-yellow-400" : ""} />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="p-1 h-auto"
                            onClick={() => removeNewImage(index)}
                            title="Remove Image"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                        {newCoverIndex === index && (
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs bg-yellow-500 text-white p-1 rounded text-center font-medium">
                              Cover Photo
                            </p>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-xs bg-black/70 text-white p-1 rounded text-center">
                            New Image {index + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {newCoverIndex >= 0 ? 
                      `New Image ${newCoverIndex + 1} will be set as cover photo` : 
                      "Click the crown on any image to set it as cover photo"
                    }
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
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditListing;


import { supabase } from "@/integrations/supabase/client";

export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

export const uploadPropertyImage = async (
  file: File, 
  userId: string, 
  propertyId: string, 
  index: number
): Promise<ImageUploadResult> => {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}-${index}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log(`Uploading image ${index + 1}:`, fileName);

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    console.log(`Image ${index + 1} uploaded successfully:`, publicUrl);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

export const deletePropertyImage = async (imagePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('property-images')
      .remove([imagePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    console.log('Image deleted successfully:', imagePath);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

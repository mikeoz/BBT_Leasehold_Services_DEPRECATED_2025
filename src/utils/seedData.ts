
import { supabase } from "@/integrations/supabase/client";

export const seedProperties = async () => {
  try {
    console.log('Starting to seed property data...');

    // Check if we already have properties to avoid duplicates
    const { data: existingProperties } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (existingProperties && existingProperties.length > 0) {
      console.log('Sample data already exists');
      return true;
    }

    // Get the current user to use as the property owner
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found. Please sign in first.');
      return false;
    }

    // First, create or update the property owner profile for the current user
    const { error: profileError } = await supabase
      .from('property_owner_profiles')
      .upsert({
        user_id: user.id,
        full_name: 'Demo Property Owner',
        email: user.email || 'demo@example.com',
        phone: '(555) 123-4567',
        business_name: 'Demo Rentals LLC'
      });

    if (profileError) {
      console.error('Error creating property owner profile:', profileError);
      return false;
    }

    // Create sample properties using the current user's ID
    const properties = [
      {
        title: 'Lakefront Cabin Retreat',
        description: 'Beautiful 3 bedroom cabin with lake views and private dock. Perfect for a family getaway with spacious living area, fully equipped kitchen, and outdoor fire pit. Enjoy kayaking, swimming, and fishing from your private dock. The cabin features a master bedroom with en-suite bathroom, two guest bedrooms with shared bathroom, and a cozy fireplace in the living room.',
        bedrooms: 3,
        bathrooms: 2,
        max_guests: 6,
        user_id: user.id,
        amenities: 'WiFi, Kitchen, Free parking, Air conditioning, Heating, Washer, Dryer, Lake access, Fireplace, Private dock',
        house_rules: 'No smoking, No parties, No pets, Check-in after 3:00 PM, Check-out before 11:00 AM',
        status: 'active'
      },
      {
        title: 'Mountain View Chalet',
        description: 'Cozy 2 bedroom mountain home with stunning views of the surrounding landscape. The perfect retreat for those seeking peace and tranquility. Featuring a wraparound deck, floor-to-ceiling windows, and an open floor plan. Nearby hiking trails and ski areas make this an ideal location for outdoor enthusiasts.',
        bedrooms: 2,
        bathrooms: 1,
        max_guests: 4,
        user_id: user.id,
        amenities: 'WiFi, Kitchen, Free parking, Heating, Mountain views, Fireplace, Hiking trails nearby',
        house_rules: 'No smoking, No parties, Check-in after 4:00 PM, Check-out before 10:00 AM',
        status: 'active'
      },
      {
        title: 'Urban Loft Downtown',
        description: 'Modern 1 bedroom loft in the heart of downtown. Perfect for business travelers or couples looking for a stylish city escape. Features exposed brick walls, high ceilings, and premium appliances. Walking distance to restaurants, shopping, and entertainment.',
        bedrooms: 1,
        bathrooms: 1,
        max_guests: 2,
        user_id: user.id,
        amenities: 'WiFi, Kitchen, Air conditioning, Heating, Downtown location, Modern appliances',
        house_rules: 'No smoking, No parties, No pets, Check-in after 3:00 PM, Check-out before 11:00 AM',
        status: 'active'
      }
    ];

    const { data: insertedProperties, error: propertiesError } = await supabase
      .from('properties')
      .insert(properties)
      .select('id');

    if (propertiesError) {
      console.error('Error creating properties:', propertiesError);
      return false;
    }

    if (!insertedProperties || insertedProperties.length === 0) {
      console.error('No properties were inserted');
      return false;
    }

    // Create property images using the actual property IDs
    const propertyImages = [
      // Lakefront Cabin images
      {
        property_id: insertedProperties[0].id,
        image_url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
        display_order: 1
      },
      {
        property_id: insertedProperties[0].id,
        image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
        display_order: 2
      },
      {
        property_id: insertedProperties[0].id,
        image_url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
        display_order: 3
      },
      // Mountain Chalet images
      {
        property_id: insertedProperties[1].id,
        image_url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
        display_order: 1
      },
      {
        property_id: insertedProperties[1].id,
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        display_order: 2
      },
      // Urban Loft images
      {
        property_id: insertedProperties[2].id,
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        display_order: 1
      },
      {
        property_id: insertedProperties[2].id,
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        display_order: 2
      }
    ];

    const { error: imagesError } = await supabase
      .from('property_images')
      .insert(propertyImages);

    if (imagesError) {
      console.error('Error creating property images:', imagesError);
      return false;
    }

    console.log('Successfully seeded property data!');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";

export const seedProperties = async () => {
  try {
    console.log('Starting to seed property data...');

    // First, create a dummy property owner profile (using a fake user ID)
    const dummyUserId = '00000000-0000-0000-0000-000000000001';
    
    const { error: profileError } = await supabase
      .from('property_owner_profiles')
      .upsert({
        user_id: dummyUserId,
        full_name: 'Demo Property Owner',
        email: 'demo@example.com',
        phone: '(555) 123-4567',
        business_name: 'Demo Rentals LLC'
      });

    if (profileError) {
      console.error('Error creating property owner profile:', profileError);
      return;
    }

    // Create sample properties
    const properties = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'Lakefront Cabin Retreat',
        description: 'Beautiful 3 bedroom cabin with lake views and private dock. Perfect for a family getaway with spacious living area, fully equipped kitchen, and outdoor fire pit. Enjoy kayaking, swimming, and fishing from your private dock. The cabin features a master bedroom with en-suite bathroom, two guest bedrooms with shared bathroom, and a cozy fireplace in the living room.',
        bedrooms: 3,
        bathrooms: 2,
        max_guests: 6,
        user_id: dummyUserId,
        amenities: 'WiFi, Kitchen, Free parking, Air conditioning, Heating, Washer, Dryer, Lake access, Fireplace, Private dock',
        house_rules: 'No smoking, No parties, No pets, Check-in after 3:00 PM, Check-out before 11:00 AM',
        status: 'active'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        title: 'Mountain View Chalet',
        description: 'Cozy 2 bedroom mountain home with stunning views of the surrounding landscape. The perfect retreat for those seeking peace and tranquility. Featuring a wraparound deck, floor-to-ceiling windows, and an open floor plan. Nearby hiking trails and ski areas make this an ideal location for outdoor enthusiasts.',
        bedrooms: 2,
        bathrooms: 1,
        max_guests: 4,
        user_id: dummyUserId,
        amenities: 'WiFi, Kitchen, Free parking, Heating, Mountain views, Fireplace, Hiking trails nearby',
        house_rules: 'No smoking, No parties, Check-in after 4:00 PM, Check-out before 10:00 AM',
        status: 'active'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        title: 'Urban Loft Downtown',
        description: 'Modern 1 bedroom loft in the heart of downtown. Perfect for business travelers or couples looking for a stylish city escape. Features exposed brick walls, high ceilings, and premium appliances. Walking distance to restaurants, shopping, and entertainment.',
        bedrooms: 1,
        bathrooms: 1,
        max_guests: 2,
        user_id: dummyUserId,
        amenities: 'WiFi, Kitchen, Air conditioning, Heating, Downtown location, Modern appliances',
        house_rules: 'No smoking, No parties, No pets, Check-in after 3:00 PM, Check-out before 11:00 AM',
        status: 'active'
      }
    ];

    const { error: propertiesError } = await supabase
      .from('properties')
      .upsert(properties);

    if (propertiesError) {
      console.error('Error creating properties:', propertiesError);
      return;
    }

    // Create property images
    const propertyImages = [
      // Lakefront Cabin images
      {
        property_id: '11111111-1111-1111-1111-111111111111',
        image_url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
        display_order: 1
      },
      {
        property_id: '11111111-1111-1111-1111-111111111111',
        image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
        display_order: 2
      },
      {
        property_id: '11111111-1111-1111-1111-111111111111',
        image_url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
        display_order: 3
      },
      // Mountain Chalet images
      {
        property_id: '22222222-2222-2222-2222-222222222222',
        image_url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
        display_order: 1
      },
      {
        property_id: '22222222-2222-2222-2222-222222222222',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        display_order: 2
      },
      // Urban Loft images
      {
        property_id: '33333333-3333-3333-3333-333333333333',
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        display_order: 1
      },
      {
        property_id: '33333333-3333-3333-3333-333333333333',
        image_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
        display_order: 2
      }
    ];

    const { error: imagesError } = await supabase
      .from('property_images')
      .upsert(propertyImages);

    if (imagesError) {
      console.error('Error creating property images:', imagesError);
      return;
    }

    console.log('Successfully seeded property data!');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    return false;
  }
};

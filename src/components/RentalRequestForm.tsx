
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RentalRequestFormProps {
  propertyId: string;
  propertyTitle: string;
  maxGuests: number;
}

const RentalRequestForm = ({ propertyId, propertyTitle, maxGuests }: RentalRequestFormProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
    message: ""
  });

  const ensureRenterProfile = async () => {
    if (!user) return false;

    // Check if renter profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('renter_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking renter profile:', checkError);
      throw checkError;
    }

    // If profile exists, we're good
    if (existingProfile) {
      return true;
    }

    // Create renter profile if it doesn't exist
    const { error: createError } = await supabase
      .from('renter_profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        full_name: user.user_metadata?.name || null,
        phone: user.user_metadata?.phone || null
      });

    if (createError) {
      console.error('Error creating renter profile:', createError);
      throw createError;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to make a rental request");
      return;
    }

    if (new Date(formData.checkInDate) >= new Date(formData.checkOutDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (formData.guests > maxGuests) {
      toast.error(`Maximum guests allowed: ${maxGuests}`);
      return;
    }

    setIsLoading(true);

    try {
      // Ensure renter profile exists before creating rental request
      await ensureRenterProfile();

      const { data: rentalRequest, error } = await supabase
        .from('rental_requests')
        .insert({
          property_id: propertyId,
          renter_id: user.id,
          check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate,
          guests: formData.guests,
          message: formData.message || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating rental request:', error);
        throw error;
      }

      // Send email notification to property owner
      try {
        await supabase.functions.invoke('send-rental-notifications', {
          body: {
            type: 'new_request',
            rental_request_id: rentalRequest.id
          }
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the request if email fails, just log it
      }

      toast.success("Rental request submitted successfully! The property owner has been notified.");
      setFormData({
        checkInDate: "",
        checkOutDate: "",
        guests: 1,
        message: ""
      });
    } catch (error) {
      console.error('Error submitting rental request:', error);
      toast.error("Failed to submit rental request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request to Stay</CardTitle>
          <CardDescription>
            Please log in to make a rental request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You need to be logged in to request a stay at this property.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request to Stay</CardTitle>
        <CardDescription>
          Submit a request to stay at {propertyTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkIn">Check-in Date</Label>
              <Input
                id="checkIn"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData(prev => ({ ...prev, checkInDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="checkOut">Check-out Date</Label>
              <Input
                id="checkOut"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData(prev => ({ ...prev, checkOutDate: e.target.value }))}
                min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max={maxGuests}
              value={formData.guests}
              onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              Maximum guests: {maxGuests}
            </p>
          </div>
          
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message to the property owner..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RentalRequestForm;


import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'new_request' | 'approved' | 'rejected';
  rental_request_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, rental_request_id }: NotificationRequest = await req.json();

    console.log(`Processing notification type: ${type} for request: ${rental_request_id}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get rental request details with related data
    const { data: rentalRequest, error } = await supabase
      .from('rental_requests')
      .select(`
        *,
        properties (
          title,
          user_id
        )
      `)
      .eq('id', rental_request_id)
      .single();

    if (error || !rentalRequest) {
      console.error('Error fetching rental request:', error);
      throw new Error('Rental request not found');
    }

    console.log('Found rental request:', rentalRequest);

    // Get property owner profile
    const { data: propertyOwner, error: ownerError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', rentalRequest.properties.user_id)
      .single();

    if (ownerError) {
      console.error('Error fetching property owner:', ownerError);
      throw new Error('Property owner not found');
    }

    // Get renter profile
    const { data: renter, error: renterError } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', rentalRequest.renter_id)
      .single();

    if (renterError) {
      console.error('Error fetching renter:', renterError);
      throw new Error('Renter not found');
    }

    console.log('Property owner:', propertyOwner);
    console.log('Renter:', renter);

    let emailResponse;

    switch (type) {
      case 'new_request':
        // Send notification to property owner
        emailResponse = await resend.emails.send({
          from: "Bethany Rentals <onboarding@resend.dev>",
          to: [propertyOwner.email],
          subject: `New Rental Request for ${rentalRequest.properties.title}`,
          html: `
            <h2>New Rental Request</h2>
            <p>Hello ${propertyOwner.full_name || 'Property Owner'},</p>
            
            <p>You have received a new rental request for your property: <strong>${rentalRequest.properties.title}</strong></p>
            
            <h3>Request Details:</h3>
            <ul>
              <li><strong>Guest:</strong> ${renter.full_name || renter.email}</li>
              <li><strong>Check-in:</strong> ${new Date(rentalRequest.check_in_date).toLocaleDateString()}</li>
              <li><strong>Check-out:</strong> ${new Date(rentalRequest.check_out_date).toLocaleDateString()}</li>
              <li><strong>Number of Guests:</strong> ${rentalRequest.guests}</li>
            </ul>
            
            ${rentalRequest.message ? `<p><strong>Message from Guest:</strong><br>${rentalRequest.message}</p>` : ''}
            
            <p>Please review and respond to this request in your dashboard.</p>
            
            <p><a href="https://xjelhichfibzkopunhpe.supabase.co/dashboard" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Dashboard</a></p>
            
            <p>Best regards,<br>The Bethany Rentals Team</p>
          `,
        });
        break;

      case 'approved':
        // Send confirmation to renter
        emailResponse = await resend.emails.send({
          from: "Bethany Rentals <onboarding@resend.dev>",
          to: [renter.email],
          subject: `Your Rental Request Has Been Approved!`,
          html: `
            <h2>Rental Request Approved</h2>
            <p>Hello ${renter.full_name || 'Guest'},</p>
            
            <p>Great news! Your rental request for <strong>${rentalRequest.properties.title}</strong> has been approved.</p>
            
            <h3>Booking Details:</h3>
            <ul>
              <li><strong>Property:</strong> ${rentalRequest.properties.title}</li>
              <li><strong>Check-in:</strong> ${new Date(rentalRequest.check_in_date).toLocaleDateString()}</li>
              <li><strong>Check-out:</strong> ${new Date(rentalRequest.check_out_date).toLocaleDateString()}</li>
              <li><strong>Number of Guests:</strong> ${rentalRequest.guests}</li>
            </ul>
            
            <h3>Important Reminders:</h3>
            <h4>Community Charter:</h4>
            <p>As a member of the Bethany community, you agree to uphold our values of respect, responsibility, and care for our shared spaces and neighbors.</p>
            
            <h4>House Rules:</h4>
            <ul>
              <li>Quiet hours: 10 PM - 7 AM</li>
              <li>No smoking anywhere on the property</li>
              <li>No parties or large gatherings</li>
              <li>Maximum occupancy as agreed in your booking</li>
              <li>Please treat the space as if it were your own home</li>
            </ul>
            
            <p>We're excited to have you stay with us! If you have any questions, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br>The Bethany Rentals Team</p>
          `,
        });
        break;

      case 'rejected':
        // Send rejection notice to renter
        emailResponse = await resend.emails.send({
          from: "Bethany Rentals <onboarding@resend.dev>",
          to: [renter.email],
          subject: `Update on Your Rental Request`,
          html: `
            <h2>Rental Request Update</h2>
            <p>Hello ${renter.full_name || 'Guest'},</p>
            
            <p>Thank you for your interest in <strong>${rentalRequest.properties.title}</strong>. Unfortunately, we're unable to accommodate your request for the dates you selected.</p>
            
            <h3>Request Details:</h3>
            <ul>
              <li><strong>Check-in:</strong> ${new Date(rentalRequest.check_in_date).toLocaleDateString()}</li>
              <li><strong>Check-out:</strong> ${new Date(rentalRequest.check_out_date).toLocaleDateString()}</li>
              <li><strong>Number of Guests:</strong> ${rentalRequest.guests}</li>
            </ul>
            
            <p>This could be due to:</p>
            <ul>
              <li>The dates are no longer available</li>
              <li>The property is undergoing maintenance</li>
              <li>Other scheduling conflicts</li>
            </ul>
            
            <p>We encourage you to browse our other available properties or consider alternative dates. You can view all our properties and make new requests on our platform.</p>
            
            <p><a href="https://xjelhichfibzkopunhpe.supabase.co/properties" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Browse Properties</a></p>
            
            <p>Thank you for your understanding, and we hope to host you in the future!</p>
            
            <p>Best regards,<br>The Bethany Rentals Team</p>
          `,
        });
        break;
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-rental-notifications function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

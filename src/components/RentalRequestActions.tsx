
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RentalRequestActionsProps {
  requestId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

const RentalRequestActions = ({ requestId, currentStatus, onStatusUpdate }: RentalRequestActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('rental_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) {
        throw error;
      }

      // Send email notification
      try {
        await supabase.functions.invoke('send-rental-notifications', {
          body: {
            type: newStatus,
            rental_request_id: requestId
          }
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the update if email fails
      }

      toast.success(`Request ${newStatus} successfully! Guest has been notified via email.`);
      onStatusUpdate();
    } catch (error) {
      console.error(`Error ${newStatus === 'approved' ? 'approving' : 'rejecting'} request:`, error);
      toast.error(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} request. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus !== 'pending') {
    return null;
  }

  return (
    <div className="flex gap-2 mt-3">
      <Button 
        size="sm" 
        onClick={() => handleStatusUpdate('approved')}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-700"
      >
        {isLoading ? 'Processing...' : 'Approve'}
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleStatusUpdate('rejected')}
        disabled={isLoading}
        className="border-red-300 text-red-700 hover:bg-red-50"
      >
        {isLoading ? 'Processing...' : 'Reject'}
      </Button>
    </div>
  );
};

export default RentalRequestActions;


-- Enable RLS on rental_requests table if not already enabled
ALTER TABLE public.rental_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Property owners can view requests for their properties" ON public.rental_requests;
DROP POLICY IF EXISTS "Renters can view their own requests" ON public.rental_requests;
DROP POLICY IF EXISTS "Renters can create requests" ON public.rental_requests;
DROP POLICY IF EXISTS "Property owners can update request status" ON public.rental_requests;

-- Policy for property owners to view requests for their properties
CREATE POLICY "Property owners can view requests for their properties"
  ON public.rental_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = rental_requests.property_id 
      AND properties.user_id = auth.uid()
    )
  );

-- Policy for renters to view their own requests
CREATE POLICY "Renters can view their own requests"
  ON public.rental_requests
  FOR SELECT
  USING (auth.uid() = renter_id);

-- Policy for renters to create requests
CREATE POLICY "Renters can create requests"
  ON public.rental_requests
  FOR INSERT
  WITH CHECK (auth.uid() = renter_id);

-- Policy for property owners to update request status (approve/reject)
CREATE POLICY "Property owners can update request status"
  ON public.rental_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE properties.id = rental_requests.property_id 
      AND properties.user_id = auth.uid()
    )
  );

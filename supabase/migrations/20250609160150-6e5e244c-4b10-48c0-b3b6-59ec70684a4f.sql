
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all active properties" ON public.properties;
DROP POLICY IF EXISTS "Users can create their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON public.properties;

-- Drop the existing foreign key constraint if it exists
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_user_id_fkey;

-- Now create a proper foreign key constraint that references the profiles table instead
ALTER TABLE public.properties 
ADD CONSTRAINT properties_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure RLS is enabled
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties table
CREATE POLICY "Users can view all active properties" 
  ON public.properties 
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Users can create their own properties" 
  ON public.properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
  ON public.properties 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
  ON public.properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

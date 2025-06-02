
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedProperties } from "@/utils/seedData";
import { useToast } from "@/hooks/use-toast";

const SeedDataButton = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      console.log('Seeding button clicked...');
      const success = await seedProperties();
      if (success) {
        toast({
          title: "Success!",
          description: "Sample property data has been created.",
        });
        // Refresh the page to show the new data
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to create sample data. Please sign in first or check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Seed data error:', error);
      toast({
        title: "Error",
        description: "Failed to create sample data. Please sign in first.",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button 
      onClick={handleSeedData} 
      disabled={isSeeding}
      variant="outline"
      size="sm"
    >
      {isSeeding ? "Creating Sample Data..." : "Create Sample Properties"}
    </Button>
  );
};

export default SeedDataButton;

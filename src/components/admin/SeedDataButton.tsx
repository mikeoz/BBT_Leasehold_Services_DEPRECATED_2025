
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
          description: "Failed to create sample data. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sample data.",
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

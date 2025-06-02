
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const SeedDataButton = () => {
  return (
    <Link to="/create-listing">
      <Button 
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Add Property
      </Button>
    </Link>
  );
};

export default SeedDataButton;

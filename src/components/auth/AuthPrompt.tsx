
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface AuthPromptProps {
  title?: string;
  description?: string;
  context?: "rental" | "general";
}

const AuthPrompt = ({ 
  title = "Sign In Required", 
  description = "Please sign in to continue",
  context = "general"
}: AuthPromptProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link to="/auth?tab=login" className="w-full">
          <Button className="w-full">Sign In</Button>
        </Link>
        <Link to="/auth?tab=signup&role=guest" className="w-full">
          <Button variant="outline" className="w-full">
            Sign Up as Guest
          </Button>
        </Link>
        {context === "rental" && (
          <p className="text-xs text-muted-foreground text-center">
            Need to list a property? <Link to="/auth?tab=signup&role=property_owner" className="underline">Sign up as Property Owner</Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthPrompt;

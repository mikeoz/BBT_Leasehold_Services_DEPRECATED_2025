import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const [selectedRole, setSelectedRole] = useState<string>("guest");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to auth page with role preselected via URL parameter
    navigate(`/auth?role=${selectedRole}&tab=signup`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Our Community</h1>
          
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
            <img 
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
              alt="Community landscape" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Our exclusive community consists of 200 homes nestled in a beautiful natural setting.
              With a focus on privacy, harmony, and shared values, we have created a special place 
              for homeowners and their guests to enjoy.
            </p>
            
            <h2>Our Community Rental Platform</h2>
            <p>
              We've created this platform to address the evolving needs of our homeowners who wish to
              share their properties with family and friends. Unlike public platforms like Airbnb or VRBO,
              our system emphasizes compliance with our community's charter and regulations.
            </p>
            <p>
              This platform ensures that all rentals remain consistent with our community's values while
              providing homeowners with a straightforward way to manage their property's availability
              and handle rental requests.
            </p>
            
            <h2>Key Benefits</h2>
            <ul>
              <li>
                <strong>Community Compliance</strong> - Our platform ensures all rentals adhere to community
                guidelines and regulations.
              </li>
              <li>
                <strong>Streamlined Process</strong> - Automated workflows keep all parties informed and
                ensure proper documentation.
              </li>
              <li>
                <strong>Enhanced Privacy</strong> - Unlike public rental platforms, ours is exclusive to
                our community members.
              </li>
              <li>
                <strong>Rental Secretary Support</strong> - Our community rental secretary helps facilitate
                communications between landlords and renters.
              </li>
            </ul>
            
            <h2>How It Works</h2>
            <ol>
              <li>
                Landlords register on the platform and create listings for their properties.
              </li>
              <li>
                Landlords manage their property's availability using our calendar system.
              </li>
              <li>
                Potential renters can browse available properties and submit reservation requests.
              </li>
              <li>
                When a reservation request is submitted, automatic notifications are sent to:
                <ul>
                  <li>The potential renter</li>
                  <li>The community rental secretary</li>
                  <li>The landlord (via the rental secretary)</li>
                </ul>
              </li>
              <li>
                All communications emphasize the importance of adhering to community rules and regulations.
              </li>
            </ol>
            
            <h2>Our Community Values</h2>
            <p>
              We believe in maintaining a peaceful, respectful environment for all residents and guests.
              Our community charter emphasizes:
            </p>
            <ul>
              <li>Respect for privacy and quiet enjoyment</li>
              <li>Environmental stewardship</li>
              <li>Shared responsibility for community spaces</li>
              <li>Support for a vibrant community life</li>
            </ul>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Get Started</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Join Our Community</DialogTitle>
                    <DialogDescription>
                      Choose how you'd like to participate in our rental platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="property_owner" id="dialog_property_owner" />
                        <label htmlFor="dialog_property_owner" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Property Owner - I want to list my property for rent
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="guest" id="dialog_guest" />
                        <label htmlFor="dialog_guest" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Guest - I want to find and book properties
                        </label>
                      </div>
                    </RadioGroup>
                    <Button onClick={handleGetStarted} className="w-full">
                      Continue
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link to="/properties">
                <Button variant="outline">Browse Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;

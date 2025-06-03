
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
          <h1 className="text-4xl font-bold mb-6">About The Bethany Beach Tabernacle</h1>
          
          <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
            <img 
              src="/lovable-uploads/9277e8a2-15e1-4636-81d9-30637fcc0d2e.png" 
              alt="Bethany Beach Tabernacle building" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p>
              We are a church committed to building up our members and equipping them to be ministers 
              and mature men and women in Christ (Ephesians 4:12-14); and reaching out to unbelievers with 
              the Gospel of Jesus Christ (Matthew 28:19). The church traces its beginnings to the Swedish 
              Baptist Churches of Chicago that first commissioned the search for the property now known as 
              Bethany Beach and to the faithful followers of Christ who have consistently worshiped as a 
              community here for more than a century.
            </p>
            
            <p className="ml-8">
              The church conducts its worship, youth and other ministries only during the summer season 
              each year for members, their guests and friends. The organized structure of the church is non-denominational, 
              but designed to reflect our dependence on the Lord of the church, Jesus Christ.
            </p>
            
            <h2>Our Rental Platform</h2>
            <p>
              We've created this platform to address the evolving needs of our homeowners who wish to 
              share their properties with family, friends and other like-minded guests who wish to visit our 
              community of believers.
            </p>
            <p>
              <strong>Please note that Leaseholds and rental opportunities are only offered in 
              compliance with the Fair Housing Act (42 U.S. Code §3607), consistent 
              with the rules and regulations of as part of the Bethany Beach 
              Tabernacle, a private religious organization.</strong>
            </p>
            <p>
              Your use of this platform ensures that all rentals remain consistent with our community's values 
              while providing homeowners with a straightforward way to manage their property's availability 
              and handle rental requests.
            </p>
            <p>
              If you have questions, please use the contact form on our main website: 
              <a href="https://www.bethanybeachtabernacle.org/contact" className="text-primary hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                https://www.bethanybeachtabernacle.org/contact
              </a>
            </p>
            
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
            </ol>
            
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


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="heading-1 mb-6 animate-fadeIn">
              Community-Exclusive Private Rental Platform
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground animate-slideUp">
              A private platform for our 200 community homeowners to share their 
              properties with family and friends while maintaining our community standards.
            </p>
            <div className="flex flex-wrap gap-4 animate-slideUp">
              <Link to="/register">
                <Button size="lg">Register as a Landlord</Button>
              </Link>
              <Link to="/properties">
                <Button variant="outline" size="lg">Browse Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform enables community members to share their homes while ensuring 
            compliance with our community's charter and regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Register Your Property</h3>
            <p className="text-muted-foreground">
              Create an account, agree to community guidelines, and list your property with photos and details.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Manage Availability</h3>
            <p className="text-muted-foreground">
              Set your property's availability using our easy-to-use calendar system.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Receive Requests</h3>
            <p className="text-muted-foreground">
              Get notified when someone wants to rent your property and review their information.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Why Use Our Platform?</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong>Community Compliance</strong>
                    <p className="text-muted-foreground">
                      Ensures all rentals comply with our community's charter and regulations.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong>Simple Workflow</strong>
                    <p className="text-muted-foreground">
                      Automated notifications keep all parties informed and ensure proper documentation.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <strong>Private Community</strong>
                    <p className="text-muted-foreground">
                      Unlike public platforms, our system is exclusive to our community members.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/about">
                  <Button>Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="aspect-video bg-muted rounded-md mb-6 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
                  alt="Community landscape" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Our Beautiful Community</h3>
              <p className="text-muted-foreground">
                Our private 200-home community provides a serene environment with exclusive 
                amenities and a strong sense of community for all residents and their guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container bg-primary text-white text-center">
        <h2 className="heading-2 mb-6">Ready to Join Our Platform?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-primary-foreground/80">
          Register today to list your property and ensure your rentals comply with our community standards.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register">
            <Button variant="secondary" size="lg">Register Now</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;

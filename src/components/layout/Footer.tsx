
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">CommunityRentals</h3>
            <p className="text-primary-foreground/80 max-w-md">
              Our platform enables 200 community homeowners to share their properties
              with friends and family while maintaining community standards.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/about" className="hover:text-accent transition-colors">
                About
              </Link>
              <Link to="/properties" className="hover:text-accent transition-colors">
                Properties
              </Link>
              <Link to="/register" className="hover:text-accent transition-colors">
                Register
              </Link>
              <Link to="/dashboard" className="hover:text-accent transition-colors">
                My Dashboard
              </Link>
            </nav>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-primary-foreground/80">
              Community Management Office<br />
              123 Community Way<br />
              Your Location, State 12345<br />
              <a href="mailto:info@communityrentals.com" className="hover:text-accent transition-colors">
                info@communityrentals.com
              </a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/70">
          <p>© {currentYear} CommunityRentals. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link to="/rules" className="hover:text-accent transition-colors">
              Community Rules
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

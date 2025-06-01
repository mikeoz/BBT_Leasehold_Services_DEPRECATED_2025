
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">CommunityRentals</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="font-medium hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/properties" className="font-medium hover:text-primary transition-colors">
            Properties
          </Link>
          <Link to="/register" className="font-medium hover:text-primary transition-colors">
            Register
          </Link>
          <Link to="/dashboard">
            <Button>My Dashboard</Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  to="/" 
                  className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/properties" 
                  className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Properties
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 bg-primary text-white rounded-md text-center mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  My Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      // The signOut function now handles the redirect, so we don't need to do it here
    } catch (error) {
      console.error("Error signing out:", error);
      // Force reload even if there's an error
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/c38e8a01-67ff-4f2f-b908-40959e65842c.png" 
              alt="Bethany Beach Tabernacle Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-primary">Community Rentals</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/properties" className="text-gray-600 hover:text-primary transition-colors">
              Properties
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              About
            </Link>
            {user && (
              <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors py-2">
                Home
              </Link>
              <Link to="/properties" className="text-gray-600 hover:text-primary transition-colors py-2">
                Properties
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors py-2">
                About
              </Link>
              {user && (
                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors py-2">
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

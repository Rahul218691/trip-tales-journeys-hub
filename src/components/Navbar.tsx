
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MessageCircle } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-sunset bg-clip-text text-transparent">
            Trip Tales
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="story-link text-foreground/80 hover:text-foreground">
            Stories
          </Link>
          <Link to="/trips" className="story-link text-foreground/80 hover:text-foreground">
            Upcoming Trips
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/create">
            <Button size="sm" className="hidden md:flex gap-2">
              <Plus size={16} />
              <span>New Story</span>
            </Button>
          </Link>
          <Link to="/create-trip">
            <Button size="sm" variant="outline" className="hidden md:flex gap-2">
              <Calendar size={16} />
              <span>Plan Trip</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link to="/messages">
              <MessageCircle size={20} />
            </Link>
          </Button>
          <Link to="/profile">
            <div className="h-8 w-8 rounded-full bg-ocean flex items-center justify-center text-white font-medium">
              U
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

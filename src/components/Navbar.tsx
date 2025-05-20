
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, MessageCircle, Menu, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  
  const handleLinkClick = () => {
    setOpen(false);
  };

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
          
          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                <Link to="/" className="px-2 py-2 hover:bg-accent rounded-md" onClick={handleLinkClick}>Stories</Link>
                <Link to="/trips" className="px-2 py-2 hover:bg-accent rounded-md" onClick={handleLinkClick}>Upcoming Trips</Link>
                <Link to="/create" className="px-2 py-2 hover:bg-accent rounded-md flex items-center gap-2" onClick={handleLinkClick}>
                  <Plus size={16} />
                  <span>New Story</span>
                </Link>
                <Link to="/create-trip" className="px-2 py-2 hover:bg-accent rounded-md flex items-center gap-2" onClick={handleLinkClick}>
                  <Calendar size={16} />
                  <span>Plan Trip</span>
                </Link>
                <Link to="/messages" className="px-2 py-2 hover:bg-accent rounded-md flex items-center gap-2" onClick={handleLinkClick}>
                  <MessageCircle size={16} />
                  <span>Messages</span>
                </Link>
                <Link to="/profile" className="px-2 py-2 hover:bg-accent rounded-md flex items-center gap-2" onClick={handleLinkClick}>
                  <User size={16} />
                  <span>Profile</span>
                </Link>
                <div className="px-2 py-2 hover:bg-accent rounded-md flex items-center gap-2 cursor-pointer text-destructive" onClick={handleLinkClick}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* User profile dropdown (visible only on medium and larger screens) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:flex">
              <div className="h-8 w-8 rounded-full bg-ocean flex items-center justify-center text-white font-medium cursor-pointer">
                U
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <Link to="/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/messages">
                <DropdownMenuItem className="cursor-pointer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

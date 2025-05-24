import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useContext, useMemo, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getDesktopNavItems, getDesktopActionItems, getMobileMenuItems } from "@/config/menuConfig";
import { logout } from "@/services/auth";
import { toast } from "sonner";
import { SET_USER_INFO } from "@/lib/constants";

const Navbar = () => {
  const { state: { user }, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  
  const handleLinkClick = useCallback(async(item: any) => {
    setOpen(false)
    if (item && item.isLogoutMenu) {
      try {
        await logout()
        dispatch({
          type: SET_USER_INFO,
          payload: { user: null, auth: false }
        })
        toast.success('Logged out successfully!')
        window.location.reload()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to logout");
      }
    }
  }, [dispatch])

  const { desktopNavItems, desktopActionItems, mobileMenuItems } = useMemo(() => {
    return {
      desktopNavItems: getDesktopNavItems(user),
      desktopActionItems: getDesktopActionItems(user),
      mobileMenuItems: getMobileMenuItems(user)
    }
  }, [user])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-ocean to-sunset bg-clip-text text-transparent">
            Trip Tales
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {desktopNavItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="story-link text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {desktopActionItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button size="sm" className="hidden md:flex gap-2" variant={item.variant}>
                {item.icon && <item.icon size={16} />}
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
          
          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                {mobileMenuItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className={`px-2 py-2 hover:bg-accent rounded-md flex items-center gap-2 ${item.variant === 'destructive' ? 'text-destructive' : ''}`}
                    onClick={() => handleLinkClick(item)}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* User profile dropdown (visible only on medium and larger screens) */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:flex">
                <div className="h-8 w-8 rounded-full bg-ocean flex items-center justify-center text-white font-medium cursor-pointer">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {mobileMenuItems.slice(4).map((item) => (
                  <Link key={item.path} to={item.path}>
                    <DropdownMenuItem onClick={() => handleLinkClick(item)} className={`cursor-pointer ${item.variant === 'destructive' ? 'text-destructive' : ''}`}>
                      {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

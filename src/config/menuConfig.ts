import { Plus, Calendar, MessageCircle, User, LogOut, LogIn, LucideIcon } from "lucide-react";

export interface MenuItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive';
  isLogoutMenu?: boolean;
}

// Base menu items that are always shown
const baseMenuItems: MenuItem[] = [
  {
    label: 'Stories',
    path: '/',
  },
  {
    label: 'Upcoming Trips',
    path: '/trips',
  },
];

// Menu items that require authentication
const authRequiredItems: MenuItem[] = [
  {
    label: 'New Story',
    path: '/create',
    icon: Plus,
  },
  {
    label: 'Plan Trip',
    path: '/create-trip',
    icon: Calendar,
  },
  {
    label: 'Messages',
    path: '/messages',
    icon: MessageCircle,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: User,
  },
  {
    label: 'Logout',
    path: '#',
    icon: LogOut,
    variant: 'destructive',
    isLogoutMenu: true
  },
];

// Menu items for unauthenticated users
const unauthenticatedItems: MenuItem[] = [
  {
    label: 'Login',
    path: '/login',
    icon: LogIn,
  },
];

// export const getMenuItems = (user: any | null) => {
//   const isAuthenticated = !!user;
//   if (isAuthenticated) {

//   }
//   return isAuthenticated 
//     ? [...baseMenuItems, ...authRequiredItems]
//     : [...baseMenuItems, ...unauthenticatedItems];
// };

export const getMenuItems = (user: any | null) => {
  const isAuthenticated = !!user;

  if (isAuthenticated) {
    const authenticatedMenu = authRequiredItems.map(item =>
      item.label === 'Profile' && user && user._id
        ? { ...item, path: `/profile/${user._id}` } // Create a new object with updated path
        : item // Return the original item
    );

    return [...baseMenuItems, ...authenticatedMenu];
  } else {
    return [...baseMenuItems, ...unauthenticatedItems];
  }
}

// Helper functions to get specific menu sections
export const getDesktopNavItems = (user: any | null) => 
  getMenuItems(user).slice(0, 2);

export const getDesktopActionItems = (user: any | null) => 
  getMenuItems(user).slice(2, 4);

export const getMobileMenuItems = (user: any | null) => 
  getMenuItems(user); 
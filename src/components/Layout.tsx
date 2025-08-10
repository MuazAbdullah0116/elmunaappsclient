
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Trophy, Settings, LogOut, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import IslamicLogo from "./IslamicLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access restricted pages
    const restrictedPaths = ["/dashboard", "/add-santri"];
    const currentPath = location.pathname;
    const isAddSetoranPath = currentPath.includes("/add-setoran");
    
    if (!user && (restrictedPaths.includes(currentPath) || isAddSetoranPath)) {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      adminOnly: true,
    },
    {
      name: "Al-Quran",
      path: "/quran",
      icon: <BookOpen className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      name: "Cari Santri",
      path: "/browse",
      icon: <UserSearch className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      name: "Prestasi",
      path: "/achievements",
      icon: <Trophy className="h-5 w-5" />,
      adminOnly: false,
    },
    {
      name: "Setelan",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
      adminOnly: false,
    },
  ];

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isAuthenticated);

  return (
    <SidebarProvider defaultOpen={false}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsible="icon">
          <SidebarContent className="py-4">
            <div className="mb-6 px-3">
              <IslamicLogo size="sm" animated />
            </div>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.name}
                    isActive={location.pathname === item.path || (item.path === "/quran" && location.pathname.startsWith("/quran/"))}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {/* Logout button for non-authenticated users */}
              {user === "Wali" && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    tooltip="Logout"
                  >
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>

      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-12 sm:h-14 max-w-screen-2xl items-center px-2 sm:px-4">
            <div className="flex-1 flex items-center justify-center md:justify-start min-w-0">
              <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold truncate">
                Pengelola Santri Al-Munawwarah
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-primary text-primary-foreground">
                {user || "Guest"}
              </span>
              {user === "Wali" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-[10px] sm:text-xs p-1 sm:p-2 h-6 sm:h-8"
                >
                  <LogOut className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container py-2 sm:py-4 md:py-6 pb-16 sm:pb-20 md:pb-6 px-2 sm:px-4 md:px-6">
          {children}
        </main>

        {/* Bottom navigation for mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
          <div className="container flex justify-around py-1.5 sm:py-2 px-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center py-1 px-1 sm:px-2 text-muted-foreground text-xs min-w-0 flex-1",
                  (location.pathname === item.path || 
                   (item.path === "/quran" && location.pathname.startsWith("/quran/"))) 
                    && "text-primary font-medium"
                )}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  {React.cloneElement(item.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                </div>
                <span className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] leading-tight text-center truncate w-full">{item.name}</span>
              </Link>
            ))}
            {/* Mobile logout button for non-authenticated users */}
            {user === "Wali" && (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center py-1 px-1 sm:px-2 text-muted-foreground text-xs min-w-0 flex-1"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] leading-tight text-center truncate w-full">Logout</span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </SidebarProvider>
  );
};

export default Layout;

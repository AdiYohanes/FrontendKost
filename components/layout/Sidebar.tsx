"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUIStore } from "@/lib/stores/uiStore";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { Building2, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useCallback } from "react";
import { notificationHistoryApi } from "@/lib/api/services/notification-history";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, initializeSidebar } = useUIStore();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    // Only fetch if user is logged in
    if (!user) return;
    
    try {
      const data = await notificationHistoryApi.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      // Silently fail - don't show error to user
      // This can happen if backend endpoint is not available yet
      console.debug('Notification count not available:', error);
      setUnreadCount(0);
    }
  }, [user]);

  // Initialize sidebar state on mount and window resize
  useEffect(() => {
    initializeSidebar();

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop && !sidebarOpen) {
        initializeSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initializeSidebar, sidebarOpen]);

  // Fetch unread count on mount and poll every 30 seconds
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Filter nav items based on user role
  const filteredNavItems = NAV_ITEMS.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={cn(
        "hidden md:flex flex-col border-r border-gray-200 bg-white transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        {sidebarOpen ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <Building2 className="h-6 w-6 text-[#1baa56]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Kost</h2>
                <p className="text-xs text-gray-500">Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft
                className="h-4 w-4 text-gray-600"
                aria-hidden="true"
              />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-10 w-10 rounded-xl hover:bg-gray-100 mx-auto"
            aria-label="Expand sidebar"
          >
            <Building2 className="h-6 w-6 text-[#1baa56]" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* User Profile Card */}
      {user && sidebarOpen && (
        <div
          className="mx-4 my-4 p-4 rounded-xl bg-gray-50 border border-gray-200"
          role="region"
          aria-label="User profile"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1baa56] text-white text-base font-bold">
              {user?.name?.charAt(0).toUpperCase() ||
                user?.username?.charAt(0).toUpperCase() ||
                "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-gray-900">
                {user?.name || user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === "OWNER" && "Owner"}
                {user?.role === "PENJAGA" && "Staff"}
                {user?.role === "PENGHUNI" && "Tenant"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Avatar Only (Collapsed) */}
      {user && !sidebarOpen && (
        <div className="flex justify-center my-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1baa56] text-white text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase() ||
              user?.username?.charAt(0).toUpperCase() ||
              "U"}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1 pb-4" aria-label="Main menu">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const isNotificationMenu = item.href === "/notifications";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative",
                  "active:scale-[0.98]",
                  isActive
                    ? "bg-[#1baa56] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  !sidebarOpen && "justify-center px-0"
                )}
                title={!sidebarOpen ? item.title : undefined}
                aria-label={item.title}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="relative">
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {isNotificationMenu && unreadCount > 0 && !sidebarOpen && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                {sidebarOpen && (
                  <span className="flex-1">{item.title}</span>
                )}
                {sidebarOpen && isNotificationMenu && unreadCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-white">
        {sidebarOpen ? (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
            aria-label="Logout from application"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span>Logout</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-full h-10 text-gray-600 hover:text-red-600 hover:bg-red-50"
            title="Logout"
            aria-label="Logout from application"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Expand Button (when collapsed) */}
      {!sidebarOpen && (
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full h-10 hover:bg-gray-100"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight
              className="h-4 w-4 text-gray-600"
              aria-hidden="true"
            />
          </Button>
        </div>
      )}
    </aside>
  );
}

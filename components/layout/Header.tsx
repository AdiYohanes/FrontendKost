"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRoom } from "@/lib/hooks/useRooms";
import { useResident } from "@/lib/hooks/useResidents";
import { GlobalSearch } from "./GlobalSearch";
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts";
import { useRef } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

// Map routes to breadcrumb labels
const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  rooms: "Rooms",
  residents: "Residents",
  utilities: "Utilities",
  invoices: "Invoices",
  laundry: "Laundry",
  complaints: "Complaints",
  fridge: "Fridge",
  expenses: "Expenses",
  reports: "Reports",
  new: "New",
  edit: "Edit",
};

function generateBreadcrumbs(
  pathname: string,
  roomData?: { id: string; roomNumber: string } | null,
  residentData?: {
    id: string;
    user: { name?: string; username: string };
  } | null
) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: Array<{ label: string; href: string }> = [];

  let currentPath = "";
  let previousSegment = "";

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Handle dynamic route segments (IDs)
    if (segment.match(/^[0-9a-f-]+$/i)) {
      let label = "Detail";

      // Check if this is a room detail page
      if (previousSegment === "rooms" && roomData?.id === segment) {
        label = roomData.roomNumber;
      }
      // Check if this is a resident detail page
      else if (
        previousSegment === "residents" &&
        residentData?.id === segment
      ) {
        label = residentData.user.name || residentData.user.username;
      }

      breadcrumbs.push({ label, href: "" });
      previousSegment = segment;
      return;
    }

    const label = routeLabels[segment] || segment;

    // Don't make the last segment clickable
    if (index === segments.length - 1) {
      breadcrumbs.push({ label, href: "" });
    } else {
      breadcrumbs.push({ label, href: currentPath });
    }

    previousSegment = segment;
  });

  return breadcrumbs;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const searchRef = useRef<any>(null);

  // Keyboard shortcut: Ctrl+K to focus search
  useKeyboardShortcuts([
    {
      key: "k",
      ctrl: true,
      callback: () => {
        searchRef.current?.focus();
      },
      description: "Focus search",
    },
  ]);

  // Extract room ID from pathname if on room detail page
  const roomIdMatch = pathname.match(/\/rooms\/([0-9a-f-]+)/i);
  const roomId = roomIdMatch ? roomIdMatch[1] : null;

  // Extract resident ID from pathname if on resident detail page
  const residentIdMatch = pathname.match(/\/residents\/([0-9a-f-]+)/i);
  const residentId = residentIdMatch ? residentIdMatch[1] : null;

  // Fetch room data if on room detail page
  const { data: roomData } = useRoom(roomId || "");

  // Fetch resident data if on resident detail page
  const { data: residentData } = useResident(residentId || "");

  const breadcrumbs = generateBreadcrumbs(pathname, roomData, residentData);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 md:px-6 shadow-sm"
      role="banner"
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden hover:bg-gray-100 h-11 w-11"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-gray-700" aria-hidden="true" />
      </Button>

      {/* Breadcrumbs */}
      <nav
        className="hidden lg:flex items-center gap-2 text-sm flex-1"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href || index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            )}
            {crumb.href ? (
              <button
                onClick={() => router.push(crumb.href)}
                className="text-gray-600 hover:text-[#1baa56] transition-colors font-medium"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="font-semibold text-gray-900">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Global Search - Hidden on mobile, shown on tablet and desktop */}
      <div className="hidden md:flex flex-1 lg:flex-initial">
        <GlobalSearch ref={searchRef} />
      </div>

      {/* User Menu */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-auto rounded-full hover:bg-gray-100 px-2 py-1.5 gap-3"
              aria-label="User menu"
            >
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col items-end">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.name || user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === "OWNER" && "Owner"}
                    {user?.role === "PENJAGA" && "Staff"}
                    {user?.role === "PENGHUNI" && "Tenant"}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1baa56] text-white text-sm font-bold ring-2 ring-gray-100 hover:ring-gray-200 transition-all">
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.username?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-white border-gray-200 shadow-lg"
          >
            {/* User Info Section */}
            <div className="px-3 py-3 bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1baa56] text-white text-base font-bold">
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.username?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.name || user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || user?.username || "No email"}
                  </p>
                </div>
              </div>
              <div className="mt-2 px-2 py-1 bg-white rounded-md border border-gray-200">
                <p className="text-xs font-medium text-gray-600">
                  {user?.role === "OWNER" && "👑 Owner"}
                  {user?.role === "PENJAGA" && "🔑 Staff"}
                  {user?.role === "PENGHUNI" && "🏠 Tenant"}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-gray-200 my-0" />

            {/* Menu Items */}
            <div className="py-1">
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
                className="mx-1 my-0.5 rounded-md hover:bg-gray-100 cursor-pointer px-3 py-2"
              >
                <User className="mr-3 h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">
                  Profile Settings
                </span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-gray-200 my-0" />

            {/* Logout */}
            <div className="py-1">
              <DropdownMenuItem
                onClick={handleLogout}
                className="mx-1 my-0.5 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer px-3 py-2"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { Building2, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  // Filter nav items based on user role
  const filteredNavItems = NAV_ITEMS.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-full p-0 bg-white border-r border-gray-200 sm:max-w-sm"
      >
        <VisuallyHidden>
          <SheetTitle>Navigation Menu</SheetTitle>
        </VisuallyHidden>

        {/* Header with Logo */}
        <div className="flex items-center p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
              <Building2 className="h-6 w-6 text-[#1baa56]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Kost</h2>
              <p className="text-xs text-gray-500">Management</p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="mx-4 my-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
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

        {/* Navigation Menu */}
        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-1 pb-4" aria-label="Main navigation">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 text-sm font-medium transition-all duration-200",
                    "min-h-[44px] py-3", // Ensure minimum touch target of 44px
                    "active:scale-[0.98]",
                    isActive
                      ? "bg-[#1baa56] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 min-h-[44px]"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

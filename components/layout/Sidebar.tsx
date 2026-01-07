"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
import { useUIStore } from "@/lib/stores/uiStore";
import {
  Home,
  Building2,
  Users,
  Zap,
  FileText,
  Shirt,
  MessageSquare,
  Refrigerator,
  Receipt,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Array<"OWNER" | "PENJAGA" | "PENGHUNI">;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Rooms",
    href: "/dashboard/rooms",
    icon: Building2,
    roles: ["OWNER", "PENJAGA"],
  },
  {
    title: "Residents",
    href: "/dashboard/residents",
    icon: Users,
    roles: ["OWNER", "PENJAGA"],
  },
  {
    title: "Utilities",
    href: "/dashboard/utilities",
    icon: Zap,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Laundry",
    href: "/dashboard/laundry",
    icon: Shirt,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Complaints",
    href: "/dashboard/complaints",
    icon: MessageSquare,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Fridge",
    href: "/dashboard/fridge",
    icon: Refrigerator,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: Receipt,
    roles: ["OWNER"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["OWNER"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-background transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {sidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Kost</span>
          </Link>
        )}
        {!sidebarOpen && (
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-full"
          >
            <Building2 className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("h-8 w-8", !sidebarOpen && "hidden")}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  !sidebarOpen && "justify-center"
                )}
                title={!sidebarOpen ? item.title : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Info */}
      {user && (
        <>
          <Separator />
          <div className="p-4">
            <div
              className={cn(
                "flex items-center gap-3",
                !sidebarOpen && "justify-center"
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Expand button when collapsed */}
      {!sidebarOpen && (
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}

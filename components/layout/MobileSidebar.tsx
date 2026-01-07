"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authStore";
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
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Kost Management</span>
          </SheetTitle>
        </SheetHeader>

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
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {user && (
          <>
            <Separator />
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() ||
                    user?.username?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {user?.name || user?.username || "User"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.role || "PENGHUNI"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

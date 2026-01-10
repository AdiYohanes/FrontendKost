/**
 * Navigation Constants
 * Centralized navigation items for sidebar and mobile menu
 */

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
  Settings,
  Bell,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Array<"OWNER" | "PENJAGA" | "PENGHUNI">;
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: Building2,
    roles: ["OWNER", "PENJAGA"],
  },
  {
    title: "Residents",
    href: "/residents",
    icon: Users,
    roles: ["OWNER", "PENJAGA"],
  },
  {
    title: "Utilities",
    href: "/utilities",
    icon: Zap,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Laundry",
    href: "/laundry",
    icon: Shirt,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Complaints",
    href: "/complaints",
    icon: MessageSquare,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Fridge",
    href: "/fridge",
    icon: Refrigerator,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
  {
    title: "Expenses",
    href: "/expenses",
    icon: Receipt,
    roles: ["OWNER"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["OWNER"],
  },
  {
    title: "Settings",
    href: "/settings/notifications",
    icon: Settings,
    roles: ["OWNER", "PENJAGA", "PENGHUNI"],
  },
];

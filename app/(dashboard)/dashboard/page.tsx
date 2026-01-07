"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Render role-based dashboard
  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  switch (user.role) {
    case "OWNER":
      return <OwnerDashboard />;
    case "PENJAGA":
      return <StaffDashboard />;
    case "PENGHUNI":
      return <TenantDashboard />;
    default:
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Invalid user role</p>
        </div>
      );
  }
}

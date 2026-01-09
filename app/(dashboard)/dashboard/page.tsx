"use client";

import dynamic from "next/dynamic";
import { useAuthStore } from "@/lib/stores/authStore";
import { CardSkeleton } from "@/components/ui/card-skeleton";

// Dynamically import dashboard components for code splitting
const OwnerDashboard = dynamic(
  () =>
    import("@/components/dashboard/OwnerDashboard").then((mod) => ({
      default: mod.OwnerDashboard,
    })),
  {
    loading: () => (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    ),
    ssr: false,
  }
);

const StaffDashboard = dynamic(
  () =>
    import("@/components/dashboard/StaffDashboard").then((mod) => ({
      default: mod.StaffDashboard,
    })),
  {
    loading: () => (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    ),
    ssr: false,
  }
);

const TenantDashboard = dynamic(
  () =>
    import("@/components/dashboard/TenantDashboard").then((mod) => ({
      default: mod.TenantDashboard,
    })),
  {
    loading: () => (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    ),
    ssr: false,
  }
);

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

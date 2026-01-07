import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Kost Management",
  description: "Login to Kost Management System",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

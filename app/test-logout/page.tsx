"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, User } from "lucide-react";

export default function TestLogoutPage() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Logout Functionality</CardTitle>
          <CardDescription>
            This page tests the logout implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authentication Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Authentication Status</h3>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isAuthenticated ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </span>
            </div>
          </div>

          {/* User Information */}
          {user && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Information</h3>
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Username: {user.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  Role: {user.role}
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="pt-4">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              disabled={!isAuthenticated}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Instructions */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Test Instructions</h3>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Login first at /login</li>
              <li>Return to this page</li>
              <li>Click the Logout button</li>
              <li>Verify you are redirected to /login</li>
              <li>Verify localStorage is cleared</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
